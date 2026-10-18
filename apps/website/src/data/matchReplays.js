/**
 * Real requests replayed on the home page map.
 *
 * Pulled from the assignments collection on 2026-10-18 (read-only). Every minute figure is
 * measured from the request's createdAt: `messaged` is the first outreach send, `yes` the
 * Interested replies that made the shortlist, `sent` when their profiles were relayed to the
 * parent. Parent details are never stored here; the town is the request's own coarse location.
 *
 * Picked for spread across levels and regions, each with a full record. Re-pull rather than
 * edit a number by hand, and keep every `sent` inside MATCH_HOURS.
 */
export const REPLAYS_AS_OF = 'June–August 2026';

export const MATCH_REPLAYS = [
  {
    title: 'Primary 1 English',
    town: 'Punggol',
    region: 'northeast',
    lonLat: [103.9065, 1.4043],
    month: 'Jun 2026',
    contacted: 14,
    messaged: 1,
    yes: [26, 34, 38],
    sent: 45,
  },
  {
    title: 'Sec 2 English',
    town: 'Jurong West',
    region: 'west',
    lonLat: [103.7065, 1.3404],
    month: 'Aug 2026',
    contacted: 22,
    messaged: 0,
    yes: [109, 113],
    sent: 160,
  },
  {
    title: 'Primary 2 Maths',
    town: 'Bedok',
    region: 'east',
    lonLat: [103.9273, 1.324],
    month: 'Aug 2026',
    contacted: 27,
    messaged: 0,
    yes: [1, 16],
    sent: 82,
  },
  {
    title: 'Sec 3 Physics',
    town: 'Hougang',
    region: 'northeast',
    lonLat: [103.8925, 1.3713],
    month: 'Jul 2026',
    contacted: 14,
    messaged: 0,
    yes: [7, 37, 47],
    sent: 110,
  },
];

/** Minutes as h:mm, the way the replay clock reads. */
export const formatClock = (mins) => `${Math.floor(mins / 60)}:${String(Math.round(mins % 60)).padStart(2, '0')}`;
