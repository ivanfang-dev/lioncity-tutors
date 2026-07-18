import { GoogleGenAI } from '@google/genai';
import { getLevelCategory } from './tutorMatcher.js';

// The single transport seam for every PARENT-facing message. Parents are never auto-messaged
// (see roadmap Repo facts): the bot owns timing, drafting, and outcome capture; the owner is
// the transport. `draftParentMessage` writes the text; `buildWaMeButton` packages it into a
// one-tap "open WhatsApp with the draft pre-filled" deep link the owner forwards themselves.
// Keeping both here means a future switch to Cloud API templates touches only this file.

let _aiClient = null;
function getAiClient() {
  if (!_aiClient) _aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return _aiClient;
}

// Telegram inline-button URLs (and WhatsApp deep links) have a practical ceiling; past it the
// draft can't ride in the URL and we fall back to a paste block. ~2KB per the Repo facts.
const WA_URL_MAX = 2000;

// SG numbers are stored/typed 8-digit; wa.me needs the country code. Longer strings are assumed
// already international. Strips spaces, +, dashes.
function toWaNumber(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits.length === 8 ? `65${digits}` : digits;
}

// A bare "open the chat" link (no pre-filled text) for the paste-block fallback path.
export function waMeLink(phone) {
  return `https://wa.me/${toWaNumber(phone)}`;
}

// An inline URL button that opens WhatsApp to the parent's chat with `text` pre-filled, or
// null when the encoded link would exceed WA_URL_MAX (caller then pastes `text` into the body).
export function buildWaMeButton(phone, text, label = 'Send via WhatsApp') {
  const url = `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(text)}`;
  if (url.length > WA_URL_MAX) return null;
  return { text: label, url };
}

// The rate to show the parent for this tutor. A quotedRate — what the tutor said they'd charge
// for THIS assignment (Phase 4) — wins over the profile rate, which is a stale guess and often
// a range the parent can't act on. Falls back to the per-level profile rate (then secondary).
// quotedRate is a transient number the caller attaches to the tutor view-model, not a stored
// tutor field.
function rateForLevel(tutor, level) {
  if (tutor.quotedRate != null) return `$${tutor.quotedRate}/hr`;
  const category = getLevelCategory(level);
  return tutor.hourlyRate?.[category] || tutor.hourlyRate?.secondary || null;
}

// One short differentiating line: the first sentence of the richest free-text field, trimmed.
function differentiator(tutor) {
  const source = tutor.trackRecord || tutor.teachingExperience || tutor.introduction || '';
  const firstSentence = source.split(/(?<=[.!?])\s/)[0].trim();
  return firstSentence.length > 140 ? `${firstSentence.slice(0, 137)}…` : firstSentence;
}

// Deterministic parent shortlist message — the guaranteed fallback when Gemini is unavailable
// or fails, and the shape the LLM draft is asked to mirror. Plain text (WhatsApp, not Telegram
// markdown): short intro + one numbered blurb per tutor + a call to choose.
function deterministicShortlist(assignment, tutors) {
  const numberEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
  const lines = [`Hi! Here are ${tutors.length} tutor${tutors.length === 1 ? '' : 's'} we've shortlisted for ${assignment.title}:`];
  tutors.forEach((t, i) => {
    const bits = [t.tutorType, t.yearsOfExperience && `${t.yearsOfExperience} experience`].filter(Boolean).join(', ');
    const rate = rateForLevel(t, assignment.level);
    lines.push('');
    lines.push(`${numberEmoji[i] || `${i + 1}.`} ${t.fullName || 'Tutor'}${bits ? ` — ${bits}` : ''}`);
    if (rate) lines.push(`   Rate: ${rate}`);
    const diff = differentiator(t);
    if (diff) lines.push(`   ${diff}`);
  });
  lines.push('');
  lines.push('Let us know which tutor you’d like to go with and we’ll arrange the rest! 😊');
  return lines.join('\n');
}

// Gemini-drafted parent shortlist message, mirroring the deterministic shape but with a
// warmer, comparison-style tone. Returns null on any failure so the caller uses the template.
async function llmShortlist(assignment, tutors) {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const profiles = tutors.map((t, i) => {
      const rate = rateForLevel(t, assignment.level) || 'Not specified';
      return [
        `${i + 1}. ${t.fullName || 'Tutor'} | Type: ${t.tutorType || 'Unknown'} | Experience: ${t.yearsOfExperience || 'Unknown'} | Rate: ${rate}`,
        `   Introduction: ${(t.introduction || 'None').slice(0, 300)}`,
        `   Teaching experience: ${(t.teachingExperience || 'None').slice(0, 300)}`,
        `   Track record: ${(t.trackRecord || 'None').slice(0, 200)}`,
      ].join('\n');
    }).join('\n\n');

    const prompt = `You are a tuition agency coordinator in Singapore writing a WhatsApp message to a PARENT who requested a tutor. Present the shortlisted tutors so the parent can choose.

Assignment: ${assignment.title} | Level: ${assignment.level} | Subject: ${assignment.subject} | Location: ${assignment.location}

Shortlisted tutors:
${profiles}

Write the WhatsApp message to the parent. Requirements:
- Warm, concise, professional. Plain text only (NO markdown, NO asterisks, NO headings).
- A one-line friendly intro, then ONE short blurb per tutor: name, type, experience, rate, and ONE differentiating strength.
- Number the tutors so the parent can reply "I'll go with tutor 2".
- Do NOT invent facts or reveal any contact details (phone/email).
- End by asking which tutor they'd like to proceed with.
Return ONLY the message text.`;

    const response = await getAiClient().models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    const text = (response.text || '').trim();
    return text.length > 0 ? text : null;
  } catch (err) {
    console.warn('parentMessage: Gemini shortlist draft failed, using template:', err.message);
    return null;
  }
}

// Deterministic reminder nudge — sent to the owner to forward when the parent has gone quiet
// on a shortlist. Short and low-pressure.
function nudgeMessage(assignment) {
  return `Hi! Just checking in on the ${assignment.title} tutor profiles we shared — were any a good fit, or would you like us to look for more options? Happy to help either way. 😊`;
}

// Deterministic "we're on it" blurb appended to the owner's creation confirmation, to forward
// to the parent so they know profiles are coming (sets the <6h expectation).
function expectationMessage(assignment) {
  return `Hi! Thanks for your request for a ${assignment.title} tutor — we're searching our tutor network now and will send you a shortlist of suitable profiles, usually within about 6 hours. We'll be in touch shortly! 😊`;
}

// Parent-forwardable budget-renegotiation blurb (Phase 8). The owner forwards this when intake
// calibration shows the posted budget is thin for the level — it quotes the typical market range
// and a suggested rate warmly, with zero pressure (parents can always keep their budget). Only
// meaningful when `calib.suggested` is set; the caller gates on that before drafting.
function budgetMessage(assignment, calib) {
  const t = calib?.typical;
  const range = t ? `around $${t.p25}–$${t.p75}/hr` : 'a little higher than usual';
  const suggested = calib?.suggested;
  const suggestLine = suggested
    ? ` A budget of about $${suggested}/hr would let us line up a strong shortlist quickly,`
    : '';
  return `Hi! Quick note on your ${assignment.title} tutor search — most experienced tutors for ${assignment.level} in your area charge ${range}.${suggestLine} but we'll do our very best whatever budget you're comfortable with. Just let us know how you'd like to proceed! 😊`;
}

// Deterministic day-30 check-in (Phase 5) — the owner forwards this to ask whether tuition is
// still going well. Names the tutor when we have it ("with Jane") so it reads as a personal
// follow-up rather than a form. The rating we capture is on the owner's recording buttons, not
// asked of the parent here — parents answer in prose, the owner grades it.
function checkInMessage(assignment, tutorName) {
  const withTutor = tutorName ? ` with ${tutorName}` : '';
  return `Hi! Just checking in — how's the ${assignment.title} tuition${withTutor} going so far? We'd love to hear any feedback, and we're always here if you need anything. 😊`;
}

// Draft any parent-facing message. `kind`:
//   'shortlist'   → payload { assignment, tutors } (LLM with deterministic fallback)
//   'nudge'       → payload { assignment }
//   'expectation' → payload { assignment }
//   'checkin'     → payload { assignment, tutorName } (day-30 check-in, Phase 5)
//   'budget'      → payload { assignment, calib } (intake budget renegotiation, Phase 8)
export async function draftParentMessage(kind, payload = {}) {
  const { assignment, tutors, tutorName, calib } = payload;
  switch (kind) {
    case 'shortlist':
      return (await llmShortlist(assignment, tutors)) || deterministicShortlist(assignment, tutors);
    case 'nudge':
      return nudgeMessage(assignment);
    case 'expectation':
      return expectationMessage(assignment);
    case 'checkin':
      return checkInMessage(assignment, tutorName);
    case 'budget':
      return budgetMessage(assignment, calib);
    default:
      throw new Error(`draftParentMessage: unknown kind "${kind}"`);
  }
}

// Exported for unit testing the guaranteed fallback shape without an API key.
export { deterministicShortlist };
