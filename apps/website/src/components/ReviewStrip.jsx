'use client';
import { MATCH_TIME } from '@/data/promises';
import React from 'react';
import { Star, Award, Clock, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE_STANDARD, STAGGER } from '@/lib/motion';

export default function ReviewStrip() {
  const prefersReducedMotion = useReducedMotion();
  const features = [
    {
      icon: Award,
      title: "Expert Tutors",
      subtitle: "MOE-trained & top uni grads"
    },
    {
      icon: Clock,
      title: "Fast Matching",
      subtitle: `Profiles sent in ${MATCH_TIME}`
    },
    {
      icon: Shield,
      title: "Zero Agency Fees",
      subtitle: "100% free for parents, always"
    }
  ];

  return (
    <section className="bg-gradient-to-r from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          
          {/* Features */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                animate={prefersReducedMotion ? undefined : { y: [16, 0] }}
                transition={{ duration: DURATION.base, delay: index * STAGGER, ease: EASE_STANDARD }}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{feature.title}</p>
                  <p className="text-sm text-white/80">{feature.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Google Rating */}
          <motion.a
            animate={prefersReducedMotion ? undefined : { y: [16, 0] }}
            transition={{ duration: DURATION.base, delay: STAGGER * 3, ease: EASE_STANDARD }}
            href="https://search.google.com/local/reviews?placeid=ChIJz5sczNYR2jERc_4Ka3tDwyY" 
            target="_blank" 
            rel="noreferrer"
            className="flex flex-col items-center lg:items-end gap-2 group justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 text-rating fill-current ${i === 4 ? 'opacity-50' : ''} group-hover:scale-110 transition-transform`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            <div className="font-bold text-white text-lg">
              4.8/5 Google Rating
            </div>
            <div className="text-xs text-white/70">
              Click to read reviews →
            </div>
          </motion.a>

        </div>
      </div>
    </section>
  );
}