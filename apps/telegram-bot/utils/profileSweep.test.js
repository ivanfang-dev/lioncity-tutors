import { describe, test, expect, afterEach } from '@jest/globals';
import { runProfileExtractionSweep } from './profileExtractor.js';

// Fakes: meta.updateOne returns a canned claim result; model.find replays the chain and returns docs.
function fakeMeta(claim) {
  return { updateOne: async () => claim };
}
function fakeModel(docs) {
  const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => docs };
  return { find: () => chain, updateOne: async () => ({}) };
}

const origKey = process.env.GEMINI_API_KEY;
afterEach(() => { if (origKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = origKey; });

describe('runProfileExtractionSweep', () => {
  test('no-op without a Gemini key (never touches the guard)', async () => {
    delete process.env.GEMINI_API_KEY;
    let claimed = false;
    const meta = { updateOne: async () => { claimed = true; return {}; } };
    const res = await runProfileExtractionSweep(new Date(), { model: fakeModel([]), meta });
    expect(res).toEqual({ ran: false });
    expect(claimed).toBe(false);
  });

  test('not due → guard claims nothing → no work', async () => {
    process.env.GEMINI_API_KEY = 'test';
    const res = await runProfileExtractionSweep(new Date(), {
      model: fakeModel([]),
      meta: fakeMeta({ modifiedCount: 0, upsertedCount: 0 }),
    });
    expect(res).toEqual({ ran: false });
  });

  test('due, but only blank profiles pending → runs, attempts nothing (no Gemini calls)', async () => {
    process.env.GEMINI_API_KEY = 'test';
    const blanks = [{ _id: '1', introduction: '' }, { _id: '2', trackRecord: '  ' }];
    const res = await runProfileExtractionSweep(new Date(), {
      model: fakeModel(blanks),
      meta: fakeMeta({ upsertedCount: 1 }),
    });
    expect(res).toEqual({ ran: true, extracted: 0, attempted: 0 });
  });
});
