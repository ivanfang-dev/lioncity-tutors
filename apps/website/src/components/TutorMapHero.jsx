'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, MapPin, Pause, Play } from 'lucide-react';
import {
  GRID,
  MAP_SRC,
  VIEWBOX,
  REGIONS,
  REGION_TUTORS,
  AREA_NAMES,
  AREA_REGIONS,
  AREA_GRID,
  TUTOR_CELLS,
  IN_PERSON_TUTORS,
  project,
} from '@/data/tutorMap';
import { MATCH_REPLAYS, REPLAYS_AS_OF, formatClock } from '@/data/matchReplays';
import { ICON_STROKE } from '@/components/guide';
import TiltSurface from '@/components/TiltSurface';
import styles from './TutorMapHero.module.css';

const BLUE = '4, 116, 186';
const ORANGE = '241, 119, 32';
const INK = '38, 38, 38';

const REGION_LABELS = {
  north: 'the North',
  south: 'the South',
  east: 'the East',
  west: 'the West',
  central: 'Central Singapore',
  northeast: 'the North-East',
  northwest: 'the North-West',
};

// One replay, in ms: pin drops, messages fly out, the clock runs the real minutes, the shortlist holds.
const LAUNCH = 700;
const LAUNCH_SPAN = 900;
const FLIGHT = 650;
const CLOCK_START = 1900;
const CLOCK_SPAN = 4600;
const HOLD = 2800;
const FADE = 450;
const TOTAL = CLOCK_START + CLOCK_SPAN + HOLD + FADE;
const IGNITION = 1500;

// The camera pushes in on each request; the canvas renders at that zoom so it stays sharp.
const ZOOM = 1.5;

const easeOut = (p) => 1 - (1 - p) ** 3;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Seeded per replay so the same tutors are messaged every time it plays.
function plan(replay, index) {
  let seed = 7919 * (index + 1);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const [px, py] = project(...replay.lonLat);
  const region = REGIONS.indexOf(replay.region);
  const pool = TUTOR_CELLS.filter((c) => c[2] === region).map(([x, y]) => ({ x, y, k: rand() }));
  const targets = pool.sort((a, b) => a.k - b.k).slice(0, replay.contacted);
  targets.forEach((t, i) => {
    t.launch = LAUNCH + (i / targets.length) * LAUNCH_SPAN;
    // Lift each arc off the straight line so messages read as sent, not ruled.
    const dx = t.x - px;
    const dy = t.y - py;
    const len = Math.hypot(dx, dy) || 1;
    const lift = Math.min(5, len * 0.4) * (rand() > 0.5 ? 1 : -1);
    t.cx = px + dx / 2 - (dy / len) * lift;
    t.cy = py + dy / 2 + (dx / len) * lift;
  });
  // The yeses go to the nearer half of the tutors, so their labels stay inside the camera's frame.
  const byDistance = [...targets].sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py));
  replay.yes.forEach((mins, i) => {
    const pick = byDistance[Math.round(((i + 1) / (replay.yes.length + 1)) * (byDistance.length - 1) * 0.6)];
    if (pick && pick.yesAt === undefined) pick.yesAt = mins;
  });
  return { px, py, targets };
}

// Where the camera sits for a point: zoomed on it, never past the map's edges.
function cameraAt(px, py) {
  const fx = (px - VIEWBOX[0]) / VIEWBOX[2];
  const fy = (py - VIEWBOX[1]) / VIEWBOX[3];
  return {
    x: clamp(0.5 - fx * ZOOM, 1 - ZOOM, 0),
    y: clamp(0.45 - fy * ZOOM, 1 - ZOOM, 0),
  };
}

const cameraFor = (replay) => cameraAt(...project(...replay.lonLat));

// The planning area under a grid point, forgiving a near miss on the coast. -1 is sea.
function areaAt(x, y) {
  for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const col = Math.round(x) + dx;
    const row = Math.round(y) + dy;
    if (col < 0 || row < 0 || col >= GRID.cols || row >= GRID.rows) continue;
    const ch = AREA_GRID[row * GRID.cols + col];
    if (ch !== '.') return ch.charCodeAt(0) - 48;
  }
  return -1;
}

const clockAt = (replay, t) => {
  if (t < CLOCK_START) return replay.messaged;
  const p = clamp01((t - CLOCK_START) / CLOCK_SPAN);
  return replay.messaged + (replay.sent - replay.messaged) * p;
};

// The moment in a replay at which a real minute lands on its clock.
const timeOf = (replay, mins) =>
  CLOCK_START + ((mins - replay.messaged) / (replay.sent - replay.messaged)) * CLOCK_SPAN;

const stageAt = (replay, t) => {
  if (t >= timeOf(replay, replay.sent)) return 3;
  if (t >= timeOf(replay, replay.yes[0])) return 2;
  if (t >= LAUNCH + LAUNCH_SPAN) return 1;
  return 0;
};

function quadPoint(ax, ay, cx, cy, bx, by, p) {
  const q = 1 - p;
  return [q * q * ax + 2 * q * p * cx + p * p * bx, q * q * ay + 2 * q * p * cy + p * p * by];
}

function strokeArc(ctx, s, a, c, b, from, to) {
  const steps = 20;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const [x, y] = quadPoint(a[0], a[1], c[0], c[1], b[0], b[1], from + ((to - from) * i) / steps);
    if (i === 0) ctx.moveTo(x * s, y * s);
    else ctx.lineTo(x * s, y * s);
  }
  ctx.stroke();
}

function ring(ctx, x, y, r, rgb, alpha, width) {
  if (alpha <= 0) return;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

function dot(ctx, x, y, r, fill, halo) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (halo) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = halo;
    ctx.stroke();
  }
  ctx.fillStyle = fill;
  ctx.fill();
}

// A small white label pinned above a tutor who said yes.
function chip(ctx, u, x, y, text, alpha, placed, font, rgb = BLUE) {
  ctx.font = `600 ${11.5 * u}px ${font}`;
  const w = ctx.measureText(text).width + 14 * u;
  const h = 22 * u;
  let top = y - h - 9 * u;
  const left = x - w / 2;
  for (const r of placed) {
    if (left < r.x + r.w && left + w > r.x && top < r.y + r.h && top + h > r.y) top = r.y - h - 4 * u;
  }
  placed.push({ x: left, y: top, w, h });
  ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 10 * u;
  ctx.shadowOffsetY = 3 * u;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(left, top, w, h, h / 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = `rgb(${rgb})`;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + 7 * u, top + h / 2 + 0.5 * u);
  ctx.globalAlpha = 1;
}

function drawReplay(ctx, s, u, replay, route, t, font) {
  const { px, py, targets } = route;
  const pin = [px, py];
  const P = [px * s, py * s];
  const exit = 1 - clamp01((t - (TOTAL - FADE)) / FADE);
  const minute = clockAt(replay, t);
  const sentAt = timeOf(replay, replay.sent);
  const line = 1.4 * u;

  ctx.lineCap = 'round';
  const answered = [];
  for (const target of targets) {
    const p = easeOut(clamp01((t - target.launch) / FLIGHT));
    if (p <= 0) continue;
    const T = [target.x * s, target.y * s];
    const c = [target.cx, target.cy];
    const end = [target.x, target.y];
    const yes = target.yesAt !== undefined && minute >= target.yesAt;

    // The message: a bright comet whose trail settles to a faint thread.
    ctx.strokeStyle = `rgba(${ORANGE}, ${(yes ? 0.55 : 0.28) * exit})`;
    ctx.lineWidth = line;
    strokeArc(ctx, s, pin, c, end, 0, p);
    if (p < 1) {
      ctx.strokeStyle = `rgba(${ORANGE}, ${0.9 * exit})`;
      ctx.lineWidth = line * 1.6;
      strokeArc(ctx, s, pin, c, end, Math.max(0, p - 0.25), p);
      const [hx, hy] = quadPoint(px, py, c[0], c[1], end[0], end[1], p);
      dot(ctx, hx * s, hy * s, 2.6 * u, `rgba(${ORANGE}, ${exit})`);
    } else if (!yes) {
      ring(ctx, T[0], T[1], 4 * u, ORANGE, 0.6 * exit, line);
    }

    if (yes) {
      // The yes travels home, then the tutor stays marked.
      const since = t - timeOf(replay, target.yesAt);
      const back = clamp01(since / 700);
      if (back < 1) {
        const [rx, ry] = quadPoint(end[0], end[1], c[0], c[1], px, py, easeOut(back));
        dot(ctx, rx * s, ry * s, 3 * u, `rgba(${BLUE}, ${exit})`, 1.5 * u);
        ring(ctx, T[0], T[1], (5 + back * 14) * u, BLUE, 0.5 * (1 - back) * exit, 1.5 * u);
      }
      dot(ctx, T[0], T[1], 4.5 * u, `rgba(${BLUE}, ${exit})`, 2 * u);
      answered.push({ T, at: target.yesAt, alpha: clamp01(since / 250) * exit });
    }
  }

  // The request pin: drops in, pulses while tutors are being asked, rings once when the shortlist goes out.
  const drop = clamp01(t / 600);
  if (drop < 1) ring(ctx, P[0], P[1], (6 + 26 * easeOut(drop)) * u, ORANGE, 0.7 * (1 - drop), 2 * u);
  if (t > 600 && t < sentAt) {
    const beat = ((t - 600) % 1300) / 1300;
    ring(ctx, P[0], P[1], (7 + 22 * easeOut(beat)) * u, ORANGE, 0.45 * (1 - beat), 1.5 * u);
  }
  const sent = clamp01((t - sentAt) / 1000);
  if (t >= sentAt && sent < 1) ring(ctx, P[0], P[1], (8 + 40 * easeOut(sent)) * u, ORANGE, 0.8 * (1 - sent) * exit, 2.5 * u);
  ctx.globalAlpha = exit * clamp01(t / 150);
  dot(ctx, P[0], P[1], 6 * u, `rgb(${ORANGE})`, 3 * u);
  ctx.globalAlpha = 1;

  const placed = [{ x: P[0] - 10 * u, y: P[1] - 10 * u, w: 20 * u, h: 20 * u }];
  for (const a of answered) chip(ctx, u, a.T[0], a.T[1], `Yes · ${formatClock(a.at)}`, a.alpha, placed, font);
}

// The parent's own pin: the tutors who cover their region light up in a wave from it, the rest dim.
function drawMine(ctx, s, u, mine, t, font) {
  const P = [mine.x * s, mine.y * s];
  const veil = clamp01(t / 500);
  for (const [x, y, r] of TUTOR_CELLS) {
    if (r === mine.region) continue;
    dot(ctx, x * s, y * s, s * 0.3, `rgba(250, 250, 250, ${0.78 * veil})`);
  }
  for (const [x, y, r] of TUTOR_CELLS) {
    if (r !== mine.region) continue;
    const p = clamp01((t - 250 - Math.hypot(x - mine.x, y - mine.y) * 45) / 600);
    if (p <= 0) continue;
    const bump = Math.sin(Math.PI * Math.min(p, 1));
    if (p < 1) ring(ctx, x * s, y * s, s * (0.3 + bump * 1.2), BLUE, 0.45 * bump, 1.2 * u);
    dot(ctx, x * s, y * s, s * (0.26 + 0.1 * easeOut(p)), `rgb(${BLUE})`, 1.2 * u * easeOut(p));
  }

  // Drops from above with a small overshoot, then breathes slowly: settled, not searching.
  const fall = clamp01(t / 420);
  const overshoot = 1 + 2.2 * (fall - 1) ** 3 + 1.2 * (fall - 1) ** 2;
  const lift = (1 - overshoot) * 26 * u;
  if (fall >= 1) {
    const land = clamp01((t - 420) / 900);
    if (land < 1) ring(ctx, P[0], P[1], (6 + 30 * easeOut(land)) * u, ORANGE, 0.7 * (1 - land), 2 * u);
    const beat = ((t - 420) % 2400) / 2400;
    ring(ctx, P[0], P[1], (7 + 14 * easeOut(beat)) * u, ORANGE, 0.3 * (1 - beat), 1.5 * u);
  }
  dot(ctx, P[0], P[1] - lift, 6.5 * u, `rgb(${ORANGE})`, 3 * u);
  chip(ctx, u, P[0], P[1] - lift - 4 * u, AREA_NAMES[mine.area], clamp01((t - 300) / 300), [], font, INK);
}

// Under a fine pointer, nearby tutors swell toward the cursor and the area under it is named.
function drawLens(ctx, s, u, pointer, font) {
  const R = 5;
  for (const [x, y] of TUTOR_CELLS) {
    const d = Math.hypot(x - pointer.x, y - pointer.y);
    if (d > R) continue;
    const f = 1 - d / R;
    dot(ctx, x * s, y * s, s * 0.25 * (1 + 0.9 * f * f), `rgba(${BLUE}, ${f})`);
  }
  const area = areaAt(pointer.x, pointer.y);
  if (area < 0) return;
  ctx.font = `600 ${11.5 * u}px ${font}`;
  const w = ctx.measureText(AREA_NAMES[area]).width + 14 * u;
  chip(ctx, u, pointer.x * s + w / 2 + 12 * u, pointer.y * s + 2 * u, AREA_NAMES[area], 1, [], font, INK);
}

// A tap on the water just ripples it.
function drawRipples(ctx, s, u, ripples, now) {
  for (const r of ripples) {
    const p = clamp01((now - r.born) / 1100);
    for (const k of [0, 0.22]) {
      const q = clamp01(p - k);
      if (q > 0 && q < 1) ring(ctx, r.x * s, r.y * s, (4 + 26 * easeOut(q)) * u, BLUE, 0.35 * (1 - q), 1.2 * u);
    }
  }
}

/**
 * The home hero's map: the live tutor pool on Singapore, replaying real requests from pin to shortlist.
 * The SVG base renders without JS; the canvas and the camera only add motion on top.
 *
 * A parent can tap their own neighbourhood: its tutors light up, and the area carries into the request.
 *
 * @param {string} [stageClassName] - lets the map, and only the map, bleed past the column
 * @param {(area: string) => void} [onRequestArea] - starts a request with the tapped area as its location
 */
export default function TutorMapHero({ stageClassName = '', onRequestArea }) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(3);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [flying, setFlying] = useState(false);
  const [mine, setMine] = useState(null);
  const [pointing, setPointing] = useState(false);
  const [exploring, setExploring] = useState(false);
  const canvasRef = useRef(null);
  const countRef = useRef(null);
  const clockRef = useRef(null);
  const progressRef = useRef(null);
  const live = useRef({
    index: 0,
    elapsed: 0,
    paused: false,
    stage: 3,
    intro: true,
    mine: null,
    exploring: false,
    pointer: null,
    ripples: [],
    pointerType: 'mouse',
  });

  const replay = MATCH_REPLAYS[index];
  // The camera pulls back to the whole island whenever the parent reaches for the map.
  const zoomed = flying && !exploring;
  const camera = !zoomed ? { x: 0, y: 0 } : mine ? cameraAt(mine.x, mine.y) : cameraFor(replay);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const font = getComputedStyle(canvas).fontFamily;
    const state = live.current;
    const routes = MATCH_REPLAYS.map(plan);
    let scale = 1;
    let unit = 1;
    let frame = 0;
    let last = 0;
    let visible = true;
    let twinkles = [];
    let introStart = null;

    const resize = () => {
      // Layout size, not the transformed box: the camera scales this element.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const zoom = motion.matches ? 1 : ZOOM;
      canvas.width = Math.round(canvas.offsetWidth * dpr * zoom);
      canvas.height = Math.round(canvas.offsetHeight * dpr * zoom);
      scale = canvas.width / VIEWBOX[2];
      // One on-screen pixel once the camera is in.
      unit = dpr;
      draw(performance.now());
    };

    const draw = (now) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(-VIEWBOX[0] * scale, -VIEWBOX[1] * scale);
      const s = scale;
      const u = unit;

      if (!motion.matches) {
        // The pool lights up once, from the middle out, settling back to the static dots.
        if (state.intro) {
          introStart ??= now;
          const it = now - introStart;
          for (const [x, y] of TUTOR_CELLS) {
            const d = Math.hypot(x - GRID.cols / 2, (y - GRID.rows / 2) * 1.6) / (GRID.cols / 2);
            const p = clamp01((it - d * 900) / 550);
            if (p <= 0 || p >= 1) continue;
            const bump = Math.sin(Math.PI * p);
            dot(ctx, x * s, y * s, s * 0.25 * (1 + bump), `rgba(${BLUE}, ${bump})`);
            ring(ctx, x * s, y * s, s * (0.3 + bump * 1.1), BLUE, 0.35 * bump, 1.2 * u);
          }
          if (it > IGNITION) {
            state.intro = false;
            setFlying(true);
          }
        }

        // A few tutors glint at a time: the pool is live, not a picture.
        if (now - (twinkles.at(-1)?.born ?? 0) > 120) {
          twinkles.push({ cell: TUTOR_CELLS[Math.floor(Math.random() * TUTOR_CELLS.length)], born: now });
        }
        twinkles = twinkles.filter((tw) => now - tw.born < 1600);
        for (const { cell, born } of twinkles) {
          const p = (now - born) / 1600;
          ring(ctx, cell[0] * s, cell[1] * s, s * (0.35 + p * 1.1), BLUE, 0.4 * Math.sin(Math.PI * p), 1.1 * u);
        }
      }

      if (state.mine) {
        drawMine(ctx, s, u, state.mine, motion.matches ? 1e5 : now - state.mine.born, font);
      } else if (!state.intro || motion.matches) {
        const t = motion.matches ? TOTAL - FADE : state.elapsed;
        drawReplay(ctx, s, u, MATCH_REPLAYS[state.index], routes[state.index], t, font);
      }

      state.ripples = state.ripples.filter((r) => now - r.born < 1400);
      if (!motion.matches) drawRipples(ctx, s, u, state.ripples, now);
      if (state.pointer && !motion.matches) drawLens(ctx, s, u, state.pointer, font);
    };

    const sync = (now) => {
      if (state.mine) {
        const n = REGION_TUTORS[REGIONS[state.mine.region]];
        const p = motion.matches ? 1 : easeOut(clamp01((now - state.mine.born - 250) / 900));
        if (countRef.current) countRef.current.textContent = Math.round(n * p);
        return;
      }
      const r = MATCH_REPLAYS[state.index];
      const t = motion.matches ? TOTAL - FADE : state.elapsed;
      const next = state.intro ? 3 : stageAt(r, t);
      if (next !== state.stage) {
        state.stage = next;
        setStage(next);
      }
      if (clockRef.current) clockRef.current.textContent = formatClock(state.intro ? r.sent : clockAt(r, t));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${state.intro ? 0 : clamp01(t / TOTAL)})`;
    };

    const tick = (now) => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (!state.intro && !state.paused && !state.mine && !state.exploring) {
        state.elapsed += dt;
        if (state.elapsed >= TOTAL) {
          state.elapsed = 0;
          state.index = (state.index + 1) % MATCH_REPLAYS.length;
          setIndex(state.index);
        }
      }
      draw(now);
      sync(now);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (motion.matches) {
        state.intro = false;
        setFlying(false);
        draw(performance.now());
        sync(performance.now());
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    // Rendering stops whenever nobody can see it.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    const onVisibility = () => start();
    document.addEventListener('visibilitychange', onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onMotion = () => {
      setReduced(motion.matches);
      resize();
      start();
    };
    motion.addEventListener('change', onMotion);
    setReduced(motion.matches);
    state.start = start;

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
    };
  }, []);

  const explore = (on) => {
    live.current.exploring = on;
    setExploring(on);
  };

  const choose = (i) => {
    const state = live.current;
    state.mine = null;
    setMine(null);
    explore(false);
    state.index = i;
    state.elapsed = 0;
    setIndex(i);
    if (state.intro) {
      state.intro = false;
      if (!reduced) setFlying(true);
    }
    state.start?.();
  };

  // Pointer position in grid units. The camera and tilt move the canvas, so read its live box.
  const toGrid = (event) => {
    const box = canvasRef.current.getBoundingClientRect();
    return {
      x: VIEWBOX[0] + ((event.clientX - box.left) / box.width) * VIEWBOX[2],
      y: VIEWBOX[1] + ((event.clientY - box.top) / box.height) * VIEWBOX[3],
    };
  };

  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const point = toGrid(event);
    live.current.pointer = point;
    setPointing(areaAt(point.x, point.y) >= 0);
  };

  const onPointerEnter = (event) => {
    if (event.pointerType === 'mouse') explore(true);
  };

  const onPointerLeave = (event) => {
    live.current.pointer = null;
    setPointing(false);
    if (event.pointerType === 'mouse') explore(false);
  };

  const onPointerDown = (event) => {
    live.current.pointerType = event.pointerType;
  };

  const onMapClick = (event) => {
    const state = live.current;
    // On touch, the first tap on a zoomed map opens up the whole island; the next one picks.
    if (state.pointerType !== 'mouse' && zoomed) {
      explore(true);
      return;
    }
    const point = toGrid(event);
    const area = areaAt(point.x, point.y);
    if (area < 0) {
      state.ripples.push({ ...point, born: performance.now() });
      return;
    }
    const next = { area, region: AREA_REGIONS[area], x: point.x, y: point.y, born: performance.now() };
    state.mine = next;
    state.intro = false;
    setMine(next);
    if (state.pointerType !== 'mouse') explore(false);
    if (!reduced) setFlying(true);
    state.start?.();
  };

  const togglePause = () => {
    live.current.paused = !live.current.paused;
    setPaused(live.current.paused);
  };

  const rows = [
    { label: `${replay.contacted} tutors messaged`, at: replay.messaged },
    { label: 'First tutor says yes', at: replay.yes[0] },
    { label: `${replay.yes.length} profiles sent to the parent`, at: replay.sent, last: true },
  ];

  return (
    <figure className="relative w-full" aria-labelledby="tutor-map-caption">
      <div className={stageClassName}>
      <TiltSurface className={`${styles.tilt} relative`}>
        <div
          className={`${styles.viewport} relative touch-manipulation`}
          style={{ aspectRatio: `${VIEWBOX[2]} / ${VIEWBOX[3]}`, cursor: pointing ? 'pointer' : 'default' }}
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onClick={onMapClick}
        >
          <div
            className={`${styles.camera} absolute inset-0`}
            style={{ transform: `translate(${camera.x * 100}%, ${camera.y * 100}%) scale(${flying ? ZOOM : 1})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- an SVG of dots gains nothing from the image optimiser */}
            <img
              src={MAP_SRC}
              alt={`Map of Singapore. Each blue dot is one of ${IN_PERSON_TUTORS} active tutors who teach in person.`}
              className="absolute inset-0 h-full w-full select-none"
              draggable={false}
              fetchPriority="high"
            />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
          </div>
        </div>
        {!mine && (
          <p
            className={`${styles.hint} pointer-events-none absolute left-0 top-1 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:top-3`}
            aria-hidden="true"
          >
            <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={ICON_STROKE} />
            <span className="pointer-coarse:hidden">Click your neighbourhood</span>
            <span className="hidden pointer-coarse:inline">Tap your neighbourhood</span>
          </p>
        )}
      </TiltSurface>
      </div>

      <div
        className="relative z-10 mx-auto -mt-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:-mt-12 sm:mr-0 lg:-mt-20"
        aria-live="polite"
      >
        {mine ? (
          <div className={styles.swap} key={`mine-${mine.area}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Your area · {REGION_LABELS[REGIONS[mine.region]]}</p>
                <p className="mt-1 font-semibold leading-snug text-gray-900">{AREA_NAMES[mine.area]}</p>
              </div>
              <p className="shrink-0 text-right leading-none">
                <span ref={countRef} className="block text-3xl font-bold tracking-tight text-primary tabular-nums">
                  {REGION_TUTORS[REGIONS[mine.region]]}
                </span>
                <span className="mt-1 block text-xs text-gray-500">tutors cover it</span>
              </p>
            </div>
            <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-600 text-pretty">
              Active tutors who teach in {REGION_LABELS[REGIONS[mine.region]]}. Tell us the level and subject, and we
              start messaging the ones who fit, usually inside a minute.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={() => onRequestArea?.(AREA_NAMES[mine.area])}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-primary-deep hover:shadow-md"
              >
                Request tutors in {AREA_NAMES[mine.area]}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => choose(index)}
                className="min-h-11 text-sm text-gray-500 underline-offset-4 transition-colors duration-200 hover:text-gray-800 hover:underline"
              >
                Back to real requests
              </button>
            </div>
          </div>
        ) : (
          <div aria-hidden="true" className={styles.swap} key={`replay-${index}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Real request · {replay.town} · {replay.month}
                </p>
                <p className="mt-1 font-semibold leading-snug text-gray-900">{replay.title}</p>
              </div>
              <p className="shrink-0 text-right leading-none">
                <span ref={clockRef} className="block text-3xl font-bold tracking-tight text-primary tabular-nums">
                  {formatClock(replay.sent)}
                </span>
                <span className="mt-1 block text-xs text-gray-500">hrs since request</span>
              </p>
            </div>

            <ol className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
              {rows.map((row, i) => {
                const done = stage > i;
                return (
                  <li key={row.label} className="flex items-center gap-3">
                    <span className={`${styles.mark} ${done ? styles.markDone : ''} ${row.last ? styles.markLast : ''}`} />
                    <span
                      className={`flex-1 transition-colors duration-300 ${
                        done ? (row.last ? 'font-semibold text-gray-900' : 'text-gray-800') : 'text-gray-400'
                      }`}
                    >
                      {row.label}
                    </span>
                    <span className={`tabular-nums transition-colors duration-300 ${done ? 'text-gray-600' : 'text-gray-300'}`}>
                      {formatClock(row.at)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 sm:justify-end">
        <div className="grid flex-1 grid-cols-4 gap-1 sm:flex sm:flex-none" role="group" aria-label="Replay a real request">
          {MATCH_REPLAYS.map((r, i) => (
            <button
              key={r.town}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={!mine && i === index}
              aria-label={`${r.title} in ${r.town}: ${r.contacted} tutors messaged, ${r.yes.length} profiles sent after ${formatClock(r.sent)} hours`}
              className={`relative min-h-11 overflow-hidden rounded-full px-2 py-2 text-[13px] leading-tight transition-colors duration-200 sm:px-3 sm:text-sm ${
                !mine && i === index ? 'bg-primary/10 font-medium text-primary-deep' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {r.town}
              {!mine && i === index && !reduced && <span ref={progressRef} className={styles.progress} aria-hidden="true" />}
            </button>
          ))}
        </div>
        {!reduced && !mine && (
          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? 'Play the replay' : 'Pause the replay'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800"
          >
            {paused ? <Play className="h-4 w-4" strokeWidth={ICON_STROKE} /> : <Pause className="h-4 w-4" strokeWidth={ICON_STROKE} />}
          </button>
        )}
      </div>

      <figcaption id="tutor-map-caption" className="mt-3 text-xs leading-relaxed text-gray-500 text-pretty sm:text-right">
        Real requests from {REPLAYS_AS_OF}, replayed at speed; times are from our matching records. Each blue dot is one
        of {IN_PERSON_TUTORS} active tutors, placed in an area they cover, never at an address.
      </figcaption>
    </figure>
  );
}
