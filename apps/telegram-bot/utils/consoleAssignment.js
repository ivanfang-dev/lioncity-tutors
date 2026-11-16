import { isValidLevelSubjectCombination } from '../../../packages/shared/client-exports.js';

// Assignments posted from the ops console: every field the channel post needs, trimmed.
const REQUIRED = ['title', 'level', 'subject', 'location', 'rate', 'frequency'];

export function validateConsoleAssignment(body) {
  const data = {};
  for (const field of REQUIRED) {
    const value = String(body?.[field] ?? '').trim();
    if (!value) return { ok: false, error: `missing_${field}` };
    data[field] = value;
  }
  if (!isValidLevelSubjectCombination(data.level, data.subject)) {
    return { ok: false, error: 'invalid_subject' };
  }
  const description = String(body?.description ?? '').trim();
  if (description) data.description = description;
  return { ok: true, data };
}
