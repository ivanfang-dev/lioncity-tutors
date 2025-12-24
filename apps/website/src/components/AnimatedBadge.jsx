'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Star } from 'lucide-react';

/**
 * Animated Badge Component
 * Usage: <AnimatedBadge text="New" color="primary" icon="sparkles" />
 */
export default function AnimatedBadge({ 
  text, 
  color = 'primary', 
  pulse = false,
  icon = null,
  size = 'sm'
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base',
  };

  const icons = {
    sparkles: Sparkles,
    trending: TrendingUp,
    zap: Zap,
    star: Star,
  };

  const IconComponent = icon ? icons[icon] : null;

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${colorClasses[color]} ${sizeClasses[size]} ${pulse ? 'animate-pulse' : ''}`}
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      {text}
    </motion.span>
  );
}
