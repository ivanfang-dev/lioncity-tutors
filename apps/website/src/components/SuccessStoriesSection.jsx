import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";
import { DURATION, EASE_STANDARD, enter } from "@/lib/motion";
import { Star, TrendingUp, Award, Quote } from "lucide-react";

// Runs before paint on the client, but falls back to useEffect during SSR so React
// doesn't warn about useLayoutEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Helper component for animating numbers.
// Seeded with the FINAL value so the server-rendered HTML shows the real figure to
// crawlers and no-JS visitors. Only once JS runs do we drop to 0 (before paint) and
// count up when the element scrolls into view — so a stat that is never scrolled to
// still reads correctly instead of being stuck at 0.
const Counter = ({ end, duration = DURATION.draw, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(end);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;
    setCount(0);
  }, [end, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true; // Prevents re-animating on scroll away and back

          // Use Framer Motion's animate function
          animate(0, end, {
            duration: duration,
            ease: EASE_STANDARD,
            onUpdate: (latest) => {
              setCount(decimals > 0 ? Number(latest).toFixed(decimals) : Math.floor(latest));
            }
          });
        }
      },
      {
        threshold: 0.5 // Start animation when 50% of the element is visible
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration, decimals, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

export default function SuccessStoriesSection() {
  const prefersReducedMotion = useReducedMotion();
  const stories = [
    {
      name: "Jonathan Goh",
      role: "JC2 Student, Raffles Institution",
      before: "D Grade (Mid-Years)",
      after: "A Grade (Prelims)",
      quote: "The MOE teacher matched for my H2 Math was exceptional. Mrs. Lim's teaching methods and the targeted practice materials were exactly what I needed to grasp complex topics.",
      initial: "J",
      improvement: "From D to A",
      subject: "H2 Mathematics"
    },
    {
      name: "Li Jie's Mother",
      role: "Parent of a P6 Student, Nan Hua Primary",
      before: "AL5 (Term 1)",
      after: "AL1 (PSLE)",
      quote: "Tutor James made Science engaging and easy to understand for my daughter. His patience and passion for teaching helped her grades improve significantly and boosted her confidence.",
      initial: "L",
      improvement: "From AL5 to AL1",
      subject: "PSLE Science"
    }
  ];

  const stats = [
    { number: "98%", label: "Successful Matches", icon: TrendingUp },
    { number: "10%", label: "Top Tutors Accepted", icon: Award },
    { number: "4.8/5", label: "Average Parent Rating", icon: Star }
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-background-subtle relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          {...enter(0, prefersReducedMotion)}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Proven Academic Results
          </div>
          <h2 className="text-primary mb-4">
            Stories of Transformation and Success
          </h2>
          <p className="text-lg text-text-default/90 max-w-3xl mx-auto leading-relaxed">
            Discover how our dedicated tutors have helped students across Singapore not only improve their grades but also build lasting confidence.
          </p>
        </motion.div>

        <motion.div
          {...enter(0, prefersReducedMotion)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-background-card rounded-2xl shadow-md border border-border">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
                <stat.icon className="w-8 h-8 text-text-inverse" />
              </div>
              <div className="text-4xl font-bold text-primary mb-1">
                {typeof stat.number === 'string' && stat.number.includes('/') ? stat.number : (
                  <Counter end={parseFloat(stat.number)} suffix={stat.number.includes('%') ? '%' : ''} decimals={stat.number.includes('.') ? 1 : 0} />
                )}
              </div>
              <div className="text-base text-text-default font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              {...enter(index, prefersReducedMotion)}
              className="group"
            >
              <div className="bg-background-card rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-border h-full flex flex-col">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-text-inverse text-2xl font-bold">{story.initial}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-text-inverse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-text-default">{story.name}</h3>
                      <p className="text-base text-text-default/80 font-medium">{story.role}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 md:px-8">
                    <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="text-text-default/70">Before:</span>
                            <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                                {story.before}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary">After:</span>
                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                {story.after}
                            </span>
                        </div>
                    </div>
                  <div className="relative h-2.5 w-full bg-border rounded-full overflow-hidden">
                    {/* Both of these rest at their FINAL position and sweep only as a
                        keyframe, so a bar whose reveal never fires reads as complete
                        rather than empty. */}
                    <motion.div
                      className="absolute top-0 left-0 h-full w-full origin-left bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-400 rounded-full"
                      initial={{ scaleX: 1 }}
                      whileInView={prefersReducedMotion ? undefined : { scaleX: [0, 1] }}
                      viewport={{ once: true, amount: 'some' }}
                      transition={{ duration: DURATION.draw, ease: EASE_STANDARD }}
                    />
                    <motion.div
                        className="absolute top-0 h-full w-2"
                        initial={{ left: '100%' }}
                        whileInView={prefersReducedMotion ? undefined : { left: ['0%', '100%'] }}
                        viewport={{ once: true, amount: 'some' }}
                        transition={{ duration: DURATION.draw, ease: EASE_STANDARD }}
                    >
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute -right-1 top-0 shadow-md"></div>
                    </motion.div>
                  </div>
                </div>

                <div className="p-6 md:p-8 mt-auto">
                  <div className="relative bg-background-default rounded-xl md:rounded-2xl p-6">
                    <Quote className="w-8 h-8 text-primary/30 absolute top-3 left-3" />
                    <p className="text-text-default/90 leading-relaxed text-base italic pl-4">
                      {story.quote}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}