// Single source of truth for the Singapore assignment picker and the
// town -> tutor-region mapping.
//
// The Telegram assignment menu (SINGAPORE_LOCATIONS) and the matcher gate
// (LOCATION_TO_REGION) are BOTH derived from the LOCATIONS array below, so
// they can never drift out of sync. Adding a town is a one-line change here:
// every town must declare the tutor-region bucket it funnels into, otherwise
// findMatchingTutors would silently notify zero tutors for that town.

// The tutor region keys (booleans on Tutor.locations). Adding a new REGION is a
// much larger change (schema + tutor re-opt-in); this list only funnels towns
// into these existing buckets.
export const REGIONS = [
  'north', 'south', 'east', 'west', 'central', 'northeast', 'northwest', 'online'
];

// Order here == order the towns appear in the Telegram menu (grouped by region).
export const LOCATIONS = [
  // Northeast
  { town: 'Sengkang', region: 'northeast' },
  { town: 'Punggol', region: 'northeast' },
  { town: 'Hougang', region: 'northeast' },
  { town: 'Serangoon', region: 'northeast' },
  { town: 'Kovan', region: 'northeast' },
  { town: 'Buangkok', region: 'northeast' },
  { town: 'Seletar', region: 'northeast' },
  { town: 'Jalan Kayu', region: 'northeast' },
  // East
  { town: 'Tampines', region: 'east' },
  { town: 'Pasir Ris', region: 'east' },
  { town: 'Bedok', region: 'east' },
  { town: 'Simei', region: 'east' },
  { town: 'East Coast', region: 'east' },
  { town: 'Katong', region: 'east' },
  { town: 'Marine Parade', region: 'east' },
  { town: 'Changi', region: 'east' },
  { town: 'Tanah Merah', region: 'east' },
  { town: 'Eunos', region: 'east' },
  { town: 'Kembangan', region: 'east' },
  { town: 'Paya Lebar', region: 'east' },
  // West
  { town: 'Jurong East', region: 'west' },
  { town: 'Jurong West', region: 'west' },
  { town: 'Clementi', region: 'west' },
  { town: 'Boon Lay', region: 'west' },
  { town: 'Pioneer', region: 'west' },
  { town: 'Buona Vista', region: 'west' },
  { town: 'Dover', region: 'west' },
  { town: 'Tengah', region: 'west' },
  { town: 'Lakeside', region: 'west' },
  { town: 'Chinese Garden', region: 'west' },
  { town: 'West Coast', region: 'west' },
  { town: 'Holland Village', region: 'west' },
  { town: 'Commonwealth', region: 'west' },
  // North
  { town: 'Woodlands', region: 'north' },
  { town: 'Sembawang', region: 'north' },
  { town: 'Yishun', region: 'north' },
  { town: 'Admiralty', region: 'north' },
  { town: 'Khatib', region: 'north' },
  { town: 'Canberra', region: 'north' },
  { town: 'Marsiling', region: 'north' },
  { town: 'Kranji', region: 'north' },
  // Northwest
  { town: 'Bukit Batok', region: 'northwest' },
  { town: 'Bukit Panjang', region: 'northwest' },
  { town: 'Choa Chu Kang', region: 'northwest' },
  { town: 'Yew Tee', region: 'northwest' },
  { town: 'Bukit Gombak', region: 'northwest' },
  // Central
  { town: 'Bishan', region: 'central' },
  { town: 'Toa Payoh', region: 'central' },
  { town: 'Ang Mo Kio', region: 'central' },
  { town: 'Novena', region: 'central' },
  { town: 'Bukit Timah', region: 'central' },
  { town: 'Orchard', region: 'central' },
  { town: 'Thomson', region: 'central' },
  { town: 'Newton', region: 'central' },
  { town: 'River Valley', region: 'central' },
  { town: 'Bugis', region: 'central' },
  { town: 'Little India', region: 'central' },
  { town: 'Farrer Park', region: 'central' },
  { town: 'Balestier', region: 'central' },
  { town: 'Potong Pasir', region: 'central' },
  { town: 'MacPherson', region: 'central' },
  { town: 'Kallang', region: 'central' },
  { town: 'Geylang', region: 'central' },
  { town: 'Aljunied', region: 'central' },
  { town: 'Yio Chu Kang', region: 'central' },
  // South
  { town: 'Tiong Bahru', region: 'south' },
  { town: 'Queenstown', region: 'south' },
  { town: 'Redhill', region: 'south' },
  { town: 'Harbourfront', region: 'south' },
  { town: 'Bukit Merah', region: 'south' },
  { town: 'Telok Blangah', region: 'south' },
  { town: 'Pasir Panjang', region: 'south' },
  { town: 'Alexandra', region: 'south' },
  { town: 'Outram', region: 'south' },
  { town: 'Tanjong Pagar', region: 'south' },
  { town: 'Chinatown', region: 'south' },
  { town: 'Sentosa', region: 'south' },
  // Other
  { town: 'Online', region: 'online' }
];

// Town strings for the Telegram inline keyboard (assignment creation, Step 4).
export const SINGAPORE_LOCATIONS = LOCATIONS.map((l) => l.town);

// Town -> tutor-region key, used as the hard matching filter in tutorMatcher.
export const LOCATION_TO_REGION = Object.fromEntries(
  LOCATIONS.map((l) => [l.town, l.region])
);
