/**
 * Builds src/data/tutorMap.js: Singapore as a dot grid, with the active tutor pool lit on it.
 *
 *   node --env-file=../telegram-bot/.env scripts/build-tutor-map.mjs <planning-areas.geojson>
 *
 * The GeoJSON is URA's "Master Plan 2019 Planning Area Boundary (No Sea)" from data.gov.sg
 * (dataset d_4765db0e87b9c86336792efe8a1f7a66). Tutors are read-only from the live DB, and only
 * their region checkboxes are used: no ids, names or addresses leave the query.
 */
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import Tutor from '../../../packages/shared/models/Tutor.js';

const [geojsonPath] = process.argv.slice(2);
if (!geojsonPath) throw new Error('Usage: build-tutor-map.mjs <planning-areas.geojson>');

// Bounds clip the far southern islands and leave one dot of sea either side; the grid pitch is about 520m.
const BOUNDS = { west: 103.6, east: 104.038667, south: 1.236, north: 1.473 };
const PITCH_KM = 0.52;
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LON = 111.32 * Math.cos((1.35 * Math.PI) / 180);
const COLS = Math.round(((BOUNDS.east - BOUNDS.west) * KM_PER_DEG_LON) / PITCH_KM);
const ROWS = Math.round(((BOUNDS.north - BOUNDS.south) * KM_PER_DEG_LAT) / PITCH_KM);

// Tutor regions follow apps/telegram-bot/utils/locations.js. Non-residential areas take no tutor dots.
const REGIONS = ['north', 'south', 'east', 'west', 'central', 'northeast', 'northwest'];
const AREAS = {
  WOODLANDS: 'north', SEMBAWANG: 'north', YISHUN: 'north',
  MANDAI: 'north*', 'SUNGEI KADUT': 'north*', SIMPANG: 'north*', 'LIM CHU KANG': 'north*',
  SENGKANG: 'northeast', PUNGGOL: 'northeast', HOUGANG: 'northeast', SERANGOON: 'northeast',
  SELETAR: 'northeast*',
  TAMPINES: 'east', 'PASIR RIS': 'east', BEDOK: 'east', 'MARINE PARADE': 'east',
  CHANGI: 'east*', 'CHANGI BAY': 'east*', 'PAYA LEBAR': 'east*',
  'JURONG EAST': 'west', 'JURONG WEST': 'west', CLEMENTI: 'west', 'BOON LAY': 'west', TENGAH: 'west',
  PIONEER: 'west*', TUAS: 'west*', 'WESTERN ISLANDS': 'west*', 'WESTERN WATER CATCHMENT': 'west*',
  'BUKIT BATOK': 'northwest', 'BUKIT PANJANG': 'northwest', 'CHOA CHU KANG': 'northwest',
  BISHAN: 'central', 'TOA PAYOH': 'central', 'ANG MO KIO': 'central', NOVENA: 'central',
  'BUKIT TIMAH': 'central', ORCHARD: 'central', NEWTON: 'central', 'RIVER VALLEY': 'central',
  ROCHOR: 'central', KALLANG: 'central', GEYLANG: 'central', TANGLIN: 'central',
  MUSEUM: 'central*', 'CENTRAL WATER CATCHMENT': 'central*',
  'BUKIT MERAH': 'south', QUEENSTOWN: 'south', OUTRAM: 'south',
  'SINGAPORE RIVER': 'south*', 'DOWNTOWN CORE': 'south*', 'MARINA SOUTH': 'south*',
  'MARINA EAST': 'south*', 'STRAITS VIEW': 'south*', 'SOUTHERN ISLANDS': 'south*',
};
// Ubin and Tekong read as another country at this scale, so they stay off the map.
const OFF_MAP = new Set(['NORTH-EASTERN ISLANDS']);

const geo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
const features = geo.features.filter((f) => !OFF_MAP.has(f.properties.PLN_AREA_N));
const areas = features.map((f) => {
  const name = f.properties.PLN_AREA_N;
  const tag = AREAS[name];
  if (!tag) throw new Error(`Unmapped planning area: ${name}`);
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return { name, region: tag.replace('*', ''), residential: !tag.endsWith('*'), polys };
});

// Even-odd ray cast over every ring, so holes subtract.
const inRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inPolys = (x, y, polys) => polys.some((rings) => rings.reduce((acc, ring) => acc !== inRing(x, y, ring), false));

const cells = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const lon = BOUNDS.west + ((col + 0.5) / COLS) * (BOUNDS.east - BOUNDS.west);
    const lat = BOUNDS.north - ((row + 0.5) / ROWS) * (BOUNDS.north - BOUNDS.south);
    const area = areas.find((a) => inPolys(lon, lat, a.polys));
    if (area) cells.push({ col, row, area: areas.indexOf(area), region: area.region, residential: area.residential });
  }
}

// Seeded so a rebuild with the same pool draws the same map.
let seed = 20261018;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
};

await mongoose.connect(process.env.MONGODB_URI);
const tutors = await Tutor.find({ pausedAt: null }).select('locations').lean();
await mongoose.disconnect();

const pools = Object.fromEntries(REGIONS.map((r) => [r, cells.filter((c) => c.residential && c.region === r)]));
const lit = new Map();
let inPerson = 0;
// Coverage, not placement: a tutor who ticks three regions counts in all three.
const regionTutors = Object.fromEntries(REGIONS.map((r) => [r, tutors.filter((t) => t.locations?.[r]).length]));
for (const t of tutors) {
  const covered = REGIONS.filter((r) => t.locations?.[r]);
  if (!covered.length) continue;
  inPerson++;
  const pool = pools[covered[Math.floor(rand() * covered.length)]];
  const cell = pool[Math.floor(rand() * pool.length)];
  lit.set(cell, (lit.get(cell) || 0) + 1);
}

// Zero-length subpaths with round caps render as dots, so a whole layer is one path.
const dots = (list) => list.map((c) => `M${c.col} ${c.row}h0`).join('');
const land = cells.filter((c) => !lit.has(c));
const VIEWBOX = [-1, -1, COLS + 1, ROWS + 1];
const areaChars = Array(COLS * ROWS).fill('.');
for (const c of cells) areaChars[c.row * COLS + c.col] = String.fromCharCode(48 + c.area);
const areaGrid = areaChars.join('');
const tutorCells = [...lit.keys()];

const out = `// Generated by scripts/build-tutor-map.mjs — do not edit by hand.
//
// Singapore on a ${PITCH_KM}km dot grid from URA's Master Plan 2019 planning areas, with the
// active tutor pool lit on it. Pulled ${new Date().toISOString().slice(0, 10)}: ${tutors.length} active tutors, ${inPerson} of them
// teaching in person. Each tutor is one dot in a residential area of a region they cover,
// picked at random among those regions: a dot is never an address.

export const TUTOR_MAP_AS_OF = '${new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })}';
export const IN_PERSON_TUTORS = ${inPerson};

export const GRID = { cols: ${COLS}, rows: ${ROWS} };

/** Lon/lat to grid units, for placing a pin on the map. */
export function project(lon, lat) {
  return [
    ((lon - ${BOUNDS.west}) / ${+(BOUNDS.east - BOUNDS.west).toFixed(6)}) * ${COLS} - 0.5,
    ((${BOUNDS.north} - lat) / ${+(BOUNDS.north - BOUNDS.south).toFixed(6)}) * ${ROWS} - 0.5,
  ];
}

export const REGIONS = ${JSON.stringify(REGIONS)};

/** Active tutors who cover each region (one tutor can cover several). */
export const REGION_TUTORS = ${JSON.stringify(regionTutors)};

/** Planning-area names, and one character per grid cell (row-major) indexing them: '.' is sea. */
export const AREA_NAMES = ${JSON.stringify(areas.map((a) => a.name.toLowerCase().replace(/(^|[\s-])\S/g, (m) => m.toUpperCase())))};
export const AREA_REGIONS = ${JSON.stringify(areas.map((a) => REGIONS.indexOf(a.region)))};
export const AREA_GRID = ${JSON.stringify(areaGrid)};

/** The static layer, drawn to public/sg-tutor-map.svg in this grid's units. */
export const MAP_SRC = '/sg-tutor-map.svg';
export const VIEWBOX = [${VIEWBOX.join(', ')}];

/** Lit cells as [col, row, regionIndex], for the canvas layer. */
export const TUTOR_CELLS = ${JSON.stringify(tutorCells.map((c) => [c.col, c.row, REGIONS.indexOf(c.region)]))};
`;

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
fs.writeFileSync(path.join(root, 'src/data/tutorMap.js'), out);
fs.writeFileSync(
  path.join(root, 'public/sg-tutor-map.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX.join(' ')}" fill="none" stroke-linecap="round">` +
    `<path stroke="#D4D4D4" stroke-width="0.36" d="${dots(land)}"/>` +
    `<path stroke="#0474BA" stroke-width="0.5" d="${dots(tutorCells)}"/></svg>\n`
);
console.log({ COLS, ROWS, land: cells.length, litCells: tutorCells.length, inPerson, bytes: out.length });

// Terminal preview: # tutor, . land.
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
for (const c of cells) grid[c.row][c.col] = lit.has(c) ? '#' : '.';
if (process.env.PREVIEW) console.log(grid.map((r) => r.join('')).join('\n'));
