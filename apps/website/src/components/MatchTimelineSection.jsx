'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MATCH_TIME, MATCH_TIMELINE, MEASURED_AS_OF } from '@/data/promises';
import { DURATION, EASE_DRAW, EASE_STANDARD, STAGGER } from '@/lib/motion';

// The one authored moment on this section: a stroke in Momentum Orange that draws
// itself left-to-right, in the same hand-drawn language as the hero underline. It is
// the page's signature motif turned up for this section rather than a new effect —
// the line literally traces the promise it is describing.
const DRAW_DURATION = DURATION.draw;             // the signature stroke owns this duration

// The stroke is drawn as one segment per gap rather than a single path across the
// whole row, so it starts at the first node and *stops* at the last one — the
// journey ends when the shortlist arrives. Each segment carries its own slight
// wobble so the line reads hand-drawn, like the hero underline, rather than ruled.
// Each path over-runs its 0–100 box at both ends so it tucks under the node dots
// rather than stopping at their edge (the svg is `overflow-visible` for this), and
// every segment enters and leaves at y=12 so consecutive segments meet cleanly.
// The wobble lives in the middle, where it reads.
const SEGMENTS_X = [
  'M -3 12 C 25 8, 55 16, 103 12',
  'M -3 12 C 30 17, 62 7, 103 12',
  'M -3 12 C 28 8, 64 17, 103 12'
];
const SEGMENTS_Y = [
  'M 12 -3 C 8 25, 16 55, 12 103',
  'M 12 -3 C 17 30, 7 62, 12 103',
  'M 12 -3 C 8 28, 17 64, 12 103'
];

// Each segment gets an equal slice of the total draw, so the stroke advances at a
// steady pace and every node lands exactly as the line reaches it.
const segmentDelay = (i) => (i * DRAW_DURATION) / SEGMENTS_X.length;
const SEGMENT_DURATION = DRAW_DURATION / SEGMENTS_X.length;

function Node({ isLast }) {
  return (
    <span
      className={`relative block rounded-full bg-accent ${
        isLast ? 'h-5 w-5 ring-4 ring-accent/20' : 'h-3.5 w-3.5'
      }`}
    />
  );
}

// Trigger as soon as any part of an element is on screen. This section carries the
// page's proof, so a reveal that fails to fire would hide the numbers entirely —
// `some` is the setting that cannot strand content off-state.
const VIEWPORT = { once: true, amount: 'some' };

// Every entrance below is expressed as a keyframe list that ENDS on the resting
// value, with `initial` already at that resting value. The reveal is therefore pure
// enhancement: if it never fires — slow JS, a background tab, a throttled observer —
// the section still renders exactly as intended, at full size and in position.
// Writing these as initial → animate instead would ship the hidden state as an inline
// style and strand the page's proof at opacity 0 or 40% scale.

export default function MatchTimelineSection() {
  const prefersReducedMotion = useReducedMotion();

  const strokeProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    // Butt, not round. The segments stretch a small viewBox across a wide column, and
    // the non-uniform scale would smear a round cap into an oval. Every segment ends
    // underneath a node dot, so there is no cap to see. (`vector-effect:
    // non-scaling-stroke` would also fix the smear, but it measures the dash in screen
    // space while framer's pathLength normalises it in user space — the two together
    // break the drawn line into gaps.)
    strokeLinecap: 'butt'
  };

  // Under reduced motion every element renders in its final state — no props at all,
  // so nothing is ever held at opacity 0 waiting for a trigger.
  // The dot pings as the stroke reaches it, then settles at its true size.
  const nodeReveal = (i) => prefersReducedMotion ? {} : {
    initial: { scale: 1 },
    whileInView: { scale: [0.4, 1] },
    viewport: VIEWPORT,
    transition: { duration: DURATION.base, delay: segmentDelay(i), ease: EASE_STANDARD }
  };

  const textReveal = (i) => prefersReducedMotion ? {} : {
    initial: { y: 0 },
    whileInView: { y: [14, 0] },
    viewport: VIEWPORT,
    transition: { duration: DURATION.base, delay: segmentDelay(i) + STAGGER, ease: EASE_STANDARD }
  };

  // One drawn segment, spanning from this node to the next.
  const Segment = ({ index, vertical }) => (
    <svg
      className={
        vertical
          ? 'absolute -left-10 top-4 h-full w-6 overflow-visible text-accent pointer-events-none'
          : 'absolute left-0 right-0 top-12 h-6 w-full overflow-visible text-accent pointer-events-none'
      }
      viewBox={vertical ? '0 0 24 100' : '0 0 100 24'}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* The un-animated track. It carries the connection on its own, so the
          timeline still reads as a timeline if the draw never runs. */}
      <path
        {...strokeProps}
        d={vertical ? SEGMENTS_Y[index] : SEGMENTS_X[index]}
        className="opacity-20"
      />
      <motion.path
        {...strokeProps}
        d={vertical ? SEGMENTS_Y[index] : SEGMENTS_X[index]}
        {...(prefersReducedMotion ? {} : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: VIEWPORT,
          transition: {
            duration: SEGMENT_DURATION,
            delay: segmentDelay(index),
            ease: EASE_DRAW
          }
        })}
      />
    </svg>
  );

  return (
    <section className="bg-background-default py-20 sm:py-28 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight text-balance">
            What happens after you hit send
          </h2>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed text-pretty">
            Not an illustration. These are median times measured from our own matching
            records as of {MEASURED_AS_OF} — from the moment a request arrives to the
            moment profiles reach a parent.
          </p>
        </div>

        {/* ── Desktop: horizontal ────────────────────────────────────────────── */}
        {/* No grid gap: each item owns its trailing space so a segment spanning the
            item's full width lands exactly on the next node. */}
        <ol className="hidden md:grid grid-cols-4">
          {MATCH_TIMELINE.map((stage, i) => (
            <li key={stage.time} className="relative pr-8 lg:pr-12">
              {i < MATCH_TIMELINE.length - 1 && <Segment index={i} />}

              <motion.p
                {...textReveal(i)}
                className="h-12 flex items-end text-3xl lg:text-4xl font-bold text-primary tabular-nums tracking-tight"
              >
                {stage.time}
              </motion.p>

              <div className="relative h-6 flex items-center">
                <motion.span {...nodeReveal(i)} className="block">
                  <Node isLast={i === MATCH_TIMELINE.length - 1} />
                </motion.span>
              </div>

              <motion.div {...textReveal(i)} className="mt-5">
                {/* Reserved height so a label that wraps at a narrow column width
                    does not shunt its own detail text out of line with the rest. */}
                <h3 className="min-h-[3.5rem] text-lg font-semibold text-text-default leading-snug text-balance">
                  {stage.label}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed text-pretty">
                  {stage.detail}
                </p>
              </motion.div>
            </li>
          ))}
        </ol>

        {/* ── Mobile: vertical ───────────────────────────────────────────────── */}
        <ol className="md:hidden pl-10">
          {MATCH_TIMELINE.map((stage, i) => (
            <li
              key={stage.time}
              className={`relative ${i === MATCH_TIMELINE.length - 1 ? '' : 'pb-9'}`}
            >
              {i < MATCH_TIMELINE.length - 1 && <Segment index={i} vertical />}

              <motion.span
                {...nodeReveal(i)}
                className="absolute -left-10 top-1.5 z-10 flex h-5 w-6 items-center justify-center"
              >
                <Node isLast={i === MATCH_TIMELINE.length - 1} />
              </motion.span>

              <motion.div {...textReveal(i)}>
                <p className="text-2xl font-bold text-primary tabular-nums tracking-tight">
                  {stage.time}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-text-default leading-snug">
                  {stage.label}
                </h3>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed text-pretty">
                  {stage.detail}
                </p>
              </motion.div>
            </li>
          ))}
        </ol>

        {/* The facts the old feature grid carried, kept as plain statements rather
            than a second row of cards. */}
        <dl className="mt-16 md:mt-20 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {[
            ['No agency fee', 'You pay the tutor directly. We never charge the family.'],
            ['Vetted before you see them', 'Every tutor is interviewed and reference-checked before we send a profile.'],
            ['Not the right fit?', 'Tell us and we send more. Rematching costs you nothing.']
          ].map(([term, description]) => (
            <div key={term} className="bg-background-default p-6 lg:p-8">
              <dt className="text-base font-semibold text-text-default">{term}</dt>
              <dd className="mt-2 text-sm text-text-secondary leading-relaxed text-pretty">
                {description}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-sm text-text-tertiary">
          Median times, measured {MEASURED_AS_OF}. Our stated promise remains {MATCH_TIME}.
        </p>
      </div>
    </section>
  );
}
