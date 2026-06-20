"use client";

import React from 'react';
import GlassSurface from './GlassSurface';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Using standard React.ReactNode for children to avoid Framer Motion type conflicts
type GlassProps = {
  children?: React.ReactNode;
  className?: string;
} & Record<string, any>;

export function GlassCard({ children, className, ...props }: GlassProps) {
  return (
    <GlassSurface
      interactive
      className={cn("p-8 md:p-12", className)}
      {...props}
    >
      {children}
    </GlassSurface>
  );
}

export function GlassButton({ children, className, ...props }: GlassProps) {
  return (
    <GlassSurface
      as="button"
      interactive
      borderRadius="9999px"
      className={cn("px-8 py-4 flex items-center justify-center transition-transform hover:scale-105 active:scale-95", className)}
      {...props}
    >
      <span className="relative z-20 font-sans uppercase tracking-[0.2em] text-xs font-medium">
         {children}
      </span>
    </GlassSurface>
  );
}

export function GlassPanel({ children, className, ...props }: GlassProps) {
    return (
      <GlassSurface
        interactive={false}
        className={cn("p-6", className)}
        {...props}
      >
        {children}
      </GlassSurface>
    );
}

export function GlassBadge({ children, className, ...props }: GlassProps) {
    return (
      <GlassSurface
        interactive={false}
        borderRadius="12px"
        className={cn("px-4 py-2 inline-flex items-center justify-center", className)}
        {...props}
      >
        <span className="font-sans text-[10px] uppercase tracking-widest opacity-80">
            {children}
        </span>
      </GlassSurface>
    );
}
