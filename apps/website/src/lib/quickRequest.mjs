// One-tap tutor request offered to parents right after a free download.

import { normalizeLeadPhone } from './phone.mjs';

const DISMISSED_KEY = 'tutorOfferDismissed';
const REQUESTED_KEY = 'tutorOfferRequested';

const subjectKey = (level, subject) => `${level || ''}|${subject || ''}`;

// The backend needs name, mobile and level; area and schedule are asked on WhatsApp.
export function quickRequestPayload({ phone, email, level, subject, paperTitle, source }) {
  const mobile = normalizeLeadPhone(phone);
  // Shelf subjects already carry the level ("Primary 6 English"), so don't say it twice.
  const firstWord = (text) => String(text || '').trim().split(/\s+/)[0].toLowerCase();
  const repeated = level && subject && firstWord(level) === firstWord(subject);
  const line = [repeated ? '' : level, subject].filter(Boolean).join(' ').trim();
  if (!mobile || !line) return null;
  const notes = [
    `Quick request after downloading ${paperTitle ? `"${paperTitle}"` : `from ${source}`}.`,
    email ? `Email: ${email}.` : '',
    'Area and schedule not asked yet.',
  ];
  return {
    name: `Parent (${source})`,
    mobile,
    level: line,
    levelSubjects: [line],
    preferences: notes.filter(Boolean).join(' '),
  };
}

const read = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const write = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    /* Storage can be blocked; the offer then simply shows again. */
  }
};

const requestedKeys = (storage) => {
  try {
    const list = JSON.parse(read(storage, REQUESTED_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

// Parents only, not after "No thanks" this visit, and once per level and subject.
export function shouldOfferTutor({ role, level, subject }, { session, local } = browserStorage()) {
  if (role !== 'parent' || !subject) return false;
  if (read(session, DISMISSED_KEY)) return false;
  return !requestedKeys(local).includes(subjectKey(level, subject));
}

export function dismissTutorOffer({ session } = browserStorage()) {
  write(session, DISMISSED_KEY, '1');
}

export function markTutorRequested({ level, subject }, { local } = browserStorage()) {
  const keys = new Set(requestedKeys(local));
  keys.add(subjectKey(level, subject));
  write(local, REQUESTED_KEY, JSON.stringify([...keys]));
}

function browserStorage() {
  return { session: globalThis.sessionStorage, local: globalThis.localStorage };
}
