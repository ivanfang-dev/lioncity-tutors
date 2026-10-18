'use client';

import { useEffect, useRef } from 'react';

const MAX_TILT = 3;

// Tilts its contents a few degrees toward a fine pointer. Touch and reduced motion get a flat surface.
export default function TiltSurface({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!el || !canTilt.matches) return undefined;

    let frame = 0;
    const move = (event) => {
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--tilt-x', `${(-y * MAX_TILT).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${(x * MAX_TILT).toFixed(2)}deg`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.removeProperty('--tilt-x');
      el.style.removeProperty('--tilt-y');
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    return () => {
      reset();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
