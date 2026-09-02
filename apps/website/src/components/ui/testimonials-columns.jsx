"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

export const TestimonialsColumn = (props) => {
  const repeatCount = Math.max(4, Math.ceil(8 / props.testimonials.length));
  // An endless scroll is the hardest motion on this page to ignore. Under reduced
  // motion the column simply sits still — every review is still readable, and the
  // duplicated copies below are just extra height.
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={props.className}>
      <motion.div
        animate={prefersReducedMotion ? undefined : { translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(repeatCount).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, initials, name, relation }, i) => (
                // p-10 (40px) inside a 320px card left ~240px of measure, which
                // on a phone wrapped review text to three or four words a line.
                <div className="p-6 sm:p-8 rounded-3xl border border-border bg-white shadow-lg shadow-primary/10 max-w-xs w-full text-pretty" key={i}>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-deep font-semibold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 tracking-tight text-gray-600">{relation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
