import test from 'node:test';
import assert from 'node:assert/strict';
import { levelBucket, createSender, queueParentNurture } from './senderNurture.mjs';

test('levelBucket maps every shelf label the gates send', () => {
  for (const l of ['Primary School', 'Primary', 'primary', 'PSLE']) assert.equal(levelBucket(l), 'Primary', l);
  for (const l of ['Secondary School', 'Secondary School (O-Level)', 'secondary', 'O-Level', 'IGCSE'])
    assert.equal(levelBucket(l), 'Secondary', l);
  for (const l of ['Junior College (A-Level)', 'Junior College', 'jc', 'A-Level'])
    assert.equal(levelBucket(l), 'JC', l);
  assert.equal(levelBucket(''), null);
  assert.equal(levelBucket(undefined), null);
});

// Minimal Sender.net stand-in: records calls, answers from `routes`.
function fakeSender(routes) {
  const calls = [];
  const fetchImpl = async (url, { method, body }) => {
    const path = url.replace('https://api.sender.net/v2', '');
    calls.push({ method, path, body: body ? JSON.parse(body) : undefined });
    const handler = routes[`${method} ${path.split('?')[0]}`];
    const out = handler ? handler(path) : {};
    const status = out?.status ?? 200;
    const json = out?.status ? out.body : out;
    return { ok: status < 400, status, json: async () => json };
  };
  return { calls, fetchImpl };
}

test('creates a new subscriber in the existing level group', async () => {
  const { calls, fetchImpl } = fakeSender({
    'GET /groups': () => ({ data: [{ id: 'g-pri', title: 'Parents · Primary' }], links: {} }),
    'GET /subscribers/mum%40gmail.com': () => ({ status: 404, body: { message: 'subscriber not found', success: false } }),
  });
  const sender = createSender({ token: 't', fetchImpl });
  const bucket = await sender.addParent({ email: 'Mum@Gmail.com ', level: 'Primary School', subject: 'Science' });

  assert.equal(bucket, 'Primary');
  const create = calls.find((c) => c.method === 'POST' && c.path === '/subscribers');
  assert.deepEqual(create.body, {
    email: 'mum@gmail.com',
    groups: ['g-pri'],
    fields: { '{{level}}': 'Primary', '{{top_subject}}': 'Science' },
  });
  assert.ok(!calls.some((c) => c.method === 'POST' && c.path === '/groups'), 'no group created');
  assert.ok(!calls.some((c) => c.path.startsWith('/subscribers/groups/')), 'add-to-group 400s for new emails');
});

test('existing subscriber is added to the group and patched without re-triggering', async () => {
  const { calls, fetchImpl } = fakeSender({
    'GET /groups': () => ({ data: [{ id: 'g-jc', title: 'Parents · JC' }], links: {} }),
    'GET /subscribers/dad%40gmail.com': () => ({ data: { email: 'dad@gmail.com' } }),
    'POST /subscribers/groups/g-jc': () => ({ success: true, message: { subscribers_added_to_group: ['dad@gmail.com'] } }),
  });
  const sender = createSender({ token: 't', fetchImpl });
  await sender.addParent({ email: 'dad@gmail.com', level: 'Junior College (A-Level)' });

  assert.deepEqual(calls.find((c) => c.path === '/subscribers/groups/g-jc').body, { subscribers: ['dad@gmail.com'] });
  const patch = calls.find((c) => c.method === 'PATCH');
  assert.equal(patch.path, '/subscribers/dad%40gmail.com');
  assert.equal(patch.body.trigger_automation, false);
  assert.ok(!calls.some((c) => c.path === '/subscribers' && c.method === 'POST'));
});

test('creates the level group on first use and caches it', async () => {
  const { calls, fetchImpl } = fakeSender({
    'GET /groups': () => ({ data: [], links: {} }),
    'POST /groups': () => ({ data: { id: 'g-sec' } }),
    'GET /subscribers/a1%40gmail.com': () => ({ status: 404, body: {} }),
    'GET /subscribers/a2%40gmail.com': () => ({ status: 404, body: {} }),
  });
  const sender = createSender({ token: 't', fetchImpl });
  await sender.addParent({ email: 'a1@gmail.com', level: 'O-Level' });
  await sender.addParent({ email: 'a2@gmail.com', level: 'Secondary School' });

  const creates = calls.filter((c) => c.method === 'POST' && c.path === '/groups');
  assert.equal(creates.length, 1);
  assert.deepEqual(creates[0].body, { title: 'Parents · Secondary' });
  assert.equal(calls.filter((c) => c.path.startsWith('/groups?')).length, 1);
});

test('skips without calling Sender when there is no token, level or valid address', async () => {
  const { calls, fetchImpl } = fakeSender({});
  assert.equal(await createSender({ token: '', fetchImpl }).addParent({ email: 'a1@gmail.com', level: 'PSLE' }), null);
  const sender = createSender({ token: 't', fetchImpl });
  assert.equal(await sender.addParent({ email: 'a1@gmail.com', level: 'Adult learner' }), null);
  assert.equal(await sender.addParent({ email: 'a1@example.com', level: 'PSLE' }), null);
  assert.equal(calls.length, 0);
});

test('queueParentNurture sends parents once per level and records it', async () => {
  const sent = [];
  const updates = [];
  const sender = { addParent: async (p) => { sent.push(p); return levelBucket(p.level); } };
  const Model = { updateOne: async (...args) => updates.push(args) };
  const pending = [];
  const opts = { sender, defer: (p) => pending.push(p) };

  queueParentNurture(Model, { _id: 1, email: 'kid@gmail.com', role: 'student' }, { level: 'PSLE' }, opts);
  queueParentNurture(Model, { _id: 2, email: 'old@gmail.com', role: null }, { level: 'PSLE' }, opts);
  queueParentNurture(Model, { _id: 3, email: 'p@gmail.com', role: 'parent', nurtureGroups: ['Primary'] }, { level: 'PSLE' }, opts);
  queueParentNurture(Model, { _id: 4, email: 'p@gmail.com', role: 'parent', nurtureGroups: ['Primary'] }, { level: 'O-Level', subject: 'Physics' }, opts);
  await Promise.all(pending);

  assert.deepEqual(sent, [{ email: 'p@gmail.com', level: 'O-Level', subject: 'Physics' }]);
  assert.deepEqual(updates, [[{ _id: 4 }, { $addToSet: { nurtureGroups: 'Secondary' } }]]);
});
