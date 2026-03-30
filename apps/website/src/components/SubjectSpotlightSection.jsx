// src/components/SubjectSpotlightSection.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Atom, Calculator, ArrowRight, Radiation } from 'lucide-react';

const subjects = [
  { 
    name: 'PSLE Math', 
    href: '/psle-math', 
    icon: Calculator, 
    description: 'Build a strong foundation for PSLE success.',
    gradient: 'from-blue-500/10 to-primary/10'
  },
  { 
    name: 'O-Level Chemistry', 
    href: '/o-level-chemistry', 
    icon: Atom, 
    description: 'Master concepts from stoichiometry to organic chemistry.',
    gradient: 'from-purple-500/10 to-accent/10'
  },
  { 
    name: 'A-Level GP', 
    href: '/a-level-physics', 
    icon: Radiation, 
    description: 'Develop critical thinking and essay writing skills.',
    gradient: 'from-green-500/10 to-primary/10'
  },
  { 
    name: 'Primary English', 
    href: '/psle-english', 
    icon: BookOpen, 
    description: 'Excel in composition, comprehension, and grammar.',
    gradient: 'from-orange-500/10 to-accent/10'
  },
];

const cardVariants = {
  offscreen: { y: 60, opacity: 0, scale: 0.95 },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8
    }
  }
};

const SubjectSpotlightSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background-subtle to-background-default relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mb-4 md:mb-6 tracking-tight">
            Find a Tutor for<br className="hidden sm:block" /> Every Subject
          </h2>
          <p className="text-lg md:text-xl text-text-default/80 max-w-3xl mx-auto leading-relaxed px-4">
            We have specialists for all core subjects and levels. Get started with one of our most requested subjects.
          </p>
        </motion.div>

        {/* Mobile: Stack cards, Desktop: Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <motion.div key={subject.name} variants={cardVariants}>
                <Link href={subject.href} passHref>
                  <div className={`group relative bg-white h-full p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-border/50 transition-all duration-500 transform hover:-translate-y-3 flex flex-col overflow-hidden`}>
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Icon with animated background */}
                    <div className="relative mb-6">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow"
                      >
                        <Icon className="w-8 h-8 text-accent group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                    </div>
                    
                    <h3 className="relative text-xl sm:text-2xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {subject.name}
                    </h3>
                    <p className="relative text-base text-text-default/80 flex-grow leading-relaxed mb-4">
                      {subject.description}
                    </p>
                    
                    {/* CTA with arrow animation */}
                    <div className="relative flex items-center text-accent font-semibold group-hover:gap-2 gap-1 transition-all duration-300">
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SubjectSpotlightSection;