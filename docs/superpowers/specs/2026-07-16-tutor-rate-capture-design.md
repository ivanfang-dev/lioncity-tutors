# Tutor rate capture at reply time (revises Phase 4 counter-offers)

Created 2026-07-16 from a design consultation on the Phase 4 counter-offer flow in
`docs/matching-pipeline-roadmap.md`.

## Problem

Phase 4 treats a counter-offer as an exception path: the tutor's job is to accept the
posted rate, and quoting their own rate is an unusual case we tolerate (Telegram gets a
"different rate?" button after ✅; WhatsApp gets a `"yes but $50"` regex). Two facts make
that framing wrong:

- **Profile rates are stale.** Tutors routinely reply "rate too low" against a rate they
  typed into their own profile. The profile rate is not a fact about the tutor, it's a
  guess. The rate a tutor names at the moment they say yes, for a specific assignment, is
  the only rate that is actually true.
- **`assignment.rate` is a free-text `String`, so ranges are everywhere.** On a
  `$40-60/hr` assignment a bare "Interested" doesn't say whether they want 40 or 60. The
  parent asks "what's their rate?" and the owner guesses.

So the rate belongs on **every** yes, not just on counter-offers.

## Prior state discovered during design

Two findings that shape the design:

1. **The feature is half-built and wired to the wrong array.** The outreach DM
   (`utils/telegramOutreach.js:78-83`) already sends two buttons:
   - `✅ Interested` → `outreach_interested_<id>` → recorded on `outreach.contacts`
   - `📝 Apply with my rate` → `apply_assignment_<id>` → prompts for a rate, validates via
     `utils/RateValidator.js`, writes to `assignment.applicants`

   `applicants` and `outreach.contacts` are separate arrays that don't talk. A tutor who
   taps "Apply with my rate" is **not** counted as Interested by the outreach pipeline:
   no contribution to `INTERESTED_TARGET`, no `shortlistRank`, no shortlist alert, and
   waves keep going out (burning WhatsApp spend) as if they never replied.

2. **In-memory sessions cannot carry this flow.** `userSessions` is a plain object
   (`api/telegram.js:14`). On Vercel Hobby any invocation can be a cold start, so
   `session.state = AWAITING_RATE` evaporates between the prompt and the tutor typing
   `45`. The existing apply flow already has this hole — `handlers.js:2773` patches around
   it for `tutorId` resolution but not for the state machine. Mandatory rate input must
   persist its pending state in the DB. That constraint is a gift: the same persisted
   design works on WhatsApp, which has no session concept at all.

## Design decisions

### 1. The two outreach buttons collapse into one

If every yes carries a rate, `✅ Interested` and `📝 Apply with my rate` are the same
action. The outreach DM drops to a single interested button (`✅ Interested — tell us your
rate`). This **deletes** the split that currently loses data rather than adding a third
path beside it.

`assignment.applicants` is untouched and keeps its real entry point: tutors browsing and
applying from the public channel post (`handlers.js:279`, `:2049`). Outreach yeses live
only in `outreach.contacts` — no dual-write, no two arrays that can drift apart.

### 2. Schema (revises Phase 4's `counterOfferRate`)

New fields on `outreach.contacts[]` in `packages/shared/models/Assignment.js`:

- `quotedRate: Number` — the rate this tutor named **for this assignment**. Replaces
  Phase 4's `counterOfferRate`: it is no longer a counter-offer, it is *the* rate, and
  the name should say so.
- `rateRequestedAt: Date` — we asked, we're awaiting the number. **This is the persisted
  state that replaces the in-memory session**, and the key the inbound matcher looks up.

Unchanged from Phase 4: `declineReason: String` (enum
`'rate' | 'distance' | 'schedule' | 'inactive' | 'other'`), `responseLatencyMins: Number`.

New field on `Tutor`: `pausedAt: Date` (unchanged from Phase 4).

### 3. One rate-capture mechanism, both channels

**WhatsApp is the primary target, not an afterthought.** The Cloud API has been live in prod
since 2026-07-10 on the dedicated outreach number, and `api/whatsapp-webhook.js` is the sole
live inbound entry point. Telegram-first routing (`sendToTutor`) only diverts tutors who have
a linked `telegramId`, so while `telegramId` coverage is low most outreach — and therefore
most rate capture — happens over WhatsApp. The design must work there first.

Two facts make WhatsApp viable:

- **No new template, no Meta approval.** The tutor's Quick-Reply tap on `assignment_match`
  ("Yes, interested" / "Not available") is an inbound message, which opens the 24h customer
  service window. The rate prompt and their reply are both free-form inside that window —
  `whatsappSender.js:sendWhatsApp()` already does exactly this send. The template is untouched.
- **The webhook already receives raw text** (`msg.text?.body`), which is what the parser needs.

**The legacy VM path is excluded because it is structurally incapable, not merely deprecated.**
`whatsapp-service/index.js:206` runs `parseReply()` on the VM and returns early on anything
that isn't yes/no, then POSTs only `{ phone, reply }` to `api/whatsapp-reply.js`. A tutor
typing `45` is discarded on the VM and never reaches the bot — no amount of work downstream
can recover it. The VM is stopped and this path is dead; do not build on it.


1. Tutor says yes → record `Interested` + `responseLatencyMins`, `$set rateRequestedAt =
   now`. Atomic `updateOne` with `arrayFilters` per the repo rules — never `.save()` a
   loaded doc.
2. Ask for the rate, quoting the posted rate for reference:
   *"What's your rate for this assignment? (posted: $40-60/hr)"*
3. **Any** next inbound message from that tutor is tried against
   `RateValidator.validate()` first. It already accepts `45`, `$45`, `45/hr`, `$45/hr`
   and warns below $10 / above $200.
4. Parses → `$set quotedRate`, clear `rateRequestedAt`, confirm to the tutor. Doesn't
   parse → falls through to existing behavior (WhatsApp forwards it to the owner's
   Telegram as a question via `forwardTutorMessage`).
5. **Matching is a DB lookup, not a session**: find that tutor's most recent contact with
   `rateRequestedAt` set and no `quotedRate`. This is what survives cold starts, and it is
   why the identical code path works on WhatsApp — after the tutor's button tap we are
   inside the 24h session, so both the ask and their reply are free-form and free.

### 4. A yes without a rate still counts

Interest is the signal; the rate is enrichment. `Interested` is recorded on the tap and
counts toward `INTERESTED_TARGET` immediately. If `quotedRate` is absent, the shortlist
falls back to the profile rate, flagged **unconfirmed**.

Rationale: blocking the target on a typed reply means a tutor who taps yes and gets
distracted is invisible to the owner while waves keep going out. Never lose a real yes.

No rate-chaser nudge in this scope (considered and deferred — it adds tick machinery for
a marginal gain).

### 5. Decline reasons, and rate declines get the same prompt

Per Phase 4, per channel:

- **Telegram:** after a ❌ tap, edit the DM to show four reason buttons (callback carries
  assignmentId + reason). Best-effort — the No is already recorded.
- **WhatsApp Cloud API webhook:** after a "Not available" button reply we're inside the
  24h session, so send a free-form interactive **list** message (4 rows; button messages
  cap at 3) and handle the list-reply in the webhook.
- **Legacy VM path** (`/api/whatsapp-reply`): excluded — see §3. The VM is stopped and the
  path cannot carry raw text regardless.

**New:** when `declineReason === 'rate'`, run the same rate prompt — same
`rateRequestedAt` field, same parser, same DB matching. The contact stays `Declined` and
does **not** count toward the target, but `quotedRate` is stored. Two payoffs:

- A tutor who declines $40 and says $70 has said exactly how far off the budget is. That
  is the raw material Phase 8's budget calibration needs, and it is currently discarded.
- It is sometimes a placement, not a decline — "too low, but I'd do $70" is something the
  owner can take back to the parent. Today it's a dead end.

If `declineReason === 'inactive'`: set `tutor.pausedAt = now`. Add `pausedAt`
absent-or-null as a hard filter in `findMatchingTutors`. Un-pause where `telegramStale`
clears in `handleContact`.

### 6. Where the rate surfaces

- **`shortlistScore`** (`utils/tutorMatcher.js`) — the budget-comfort term prefers
  `quotedRate` when present over regex-parsing the profile's `hourlyRate` text. A fresh
  number beats a parsed guess.
- **Owner shortlist alert / console rows** — render `$45 quoted · $40-60 posted` so the
  owner sees it before relaying.
- **Phase 2's parent draft** — quotes the real rate rather than the profile's.
- **Over-ceiling quotes** (posted $40-60, tutor quotes $75): still `Interested`, flagged
  in the alert. Consistent with Phase 8's "calibration informs, never prevents" — the
  parent might stretch; that's the owner's call, not the bot's.

### 7. Parse order in the WhatsApp webhook

Three parsers now compete for the same inbound text. Order is load-bearing:

1. **Rate** — only if that tutor has a contact with a pending `rateRequestedAt`.
2. **Yes/no intent** — button payloads, then the free-text fallback (Phase 4: keyword
   match, so tutors who type instead of tapping are still recorded).
3. **Fall through** — forward to the owner's Telegram as a question.

Without this order a tutor answering `40` to a rate prompt on a `$40-60` assignment can
be swallowed by the wrong handler.

**The combined `"yes but $50"` case is deliberately not special-cased.** Phase 4 planned
a regex for it; here it needs none. The message has no pending `rateRequestedAt` yet, so
it hits the yes/no parser, is recorded `Interested`, and the rate prompt follows — the
tutor answers `50` and the normal path takes it. Asking a tutor to restate a number they
just volunteered is a small cost; a second, looser rate extractor competing with the
strict one is a permanent one. `RateValidator`'s anchored regex
(`/^\$?(\d+(?:\.\d{1,2})?)(?:\/hr)?$/i`) stays strict and stays the only rate parser.

## Testing

- Unit: `responseLatencyMins` math; rate parsing across `45` / `$45` / `45/hr` / `$45/hr`
  / junk; the pending-contact matcher picking the most recent `rateRequestedAt` row; the
  `pausedAt` hard filter in `findMatchingTutors`; parse-order precedence (a bare number
  with a pending request must not reach the yes/no parser).
- Integration: simulate the full yes → rate → `quotedRate` round trip and the
  decline → reason=rate → `quotedRate` round trip via webhook payloads (`curl` to the
  webhook with the `x-api-key` header).
- Cold-start: confirm the rate lands with **no** prior in-memory session for that tutor —
  the specific failure the persisted design exists to prevent.
- Manual: `TEST_RECIPIENT_PHONE` to redirect a wave; verify DB state with
  `node --env-file=apps/telegram-bot/.env <script>`.
- **WhatsApp end-to-end is the primary acceptance test**, not Telegram — it is the channel
  most tutors are reached on. Prove the full window flow on a real number: template send →
  Quick-Reply tap → rate prompt delivers in-window → typed `45` → `quotedRate` set.

## Out of scope

- The rate-chaser nudge (see §4).
- Any change to `assignment.applicants` or the channel-post apply flow.
- The legacy `/api/whatsapp-reply` VM path.
- Numeric rate backfill (`rateNumeric`) — that's Phase 7. `quotedRate` is `Number` from
  the start and needs no backfill; legacy contacts simply have it absent.

## Roadmap impact

`docs/matching-pipeline-roadmap.md` Phase 4 should be updated to reflect: `quotedRate`
replacing `counterOfferRate`, rate capture on every yes rather than as an exception, the
button collapse, the persisted-state requirement, and rate capture on rate-declines.
