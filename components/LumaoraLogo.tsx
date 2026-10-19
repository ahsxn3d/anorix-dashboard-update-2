'use client'

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { sound } from '@/lib/sound';

interface LumaoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
}

export const LumaoraLogo: React.FC<LumaoraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  animated = true,
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', text: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', text: 'text-lg', sub: 'text-xs' },
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Animated Vector Logo Mark */}
      <div className={`relative flex items-center justify-center ${sizeMap[size].box} shrink-0 group`}>
        {/* 1. Outer Neon Aura Glow Pulse */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#3B82F6] via-[#A1A1A1] to-[#A1A1A1] opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 animate-pulse-glow" />

        {/* 2. Outer Rotating Cyber Ring (Clockwise) */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none ${animated ? 'animate-spin-slow' : ''}`}
          viewBox="0 0 44 44"
          fill="none"
        >
          <circle
            cx="22"
            cy="22"
            r="19.5"
            stroke="url(#lumaoraGradient1)"
            strokeWidth="1.75"
            strokeDasharray="14 18"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="lumaoraGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#A1A1A1" />
              <stop offset="100%" stopColor="#A1A1A1" />
            </linearGradient>
          </defs>
        </svg>

        {/* 3. Inner Counter-Rotating Hex Ring */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none opacity-70 ${
            animated ? 'animate-spin-reverse-slow' : ''
          }`}
          viewBox="0 0 44 44"
          fill="none"
        >
          <circle
            cx="22"
            cy="22"
            r="15"
            stroke="#A1A1A1"
            strokeWidth="1.2"
            strokeDasharray="6 20"
            strokeLinecap="round"
          />
        </svg>

        {/* 4. Embossed Holographic Reactor Core (3D Emboss with Inset Shadow) */}
        <motion.div
          whileHover={{ scale: 1.12, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 15 }}
          className="relative w-7 h-7 rounded-xl bg-gradient-to-br from-[#1b0a38] via-[#111111] to-[#0A0A0A] flex items-center justify-center border border-neutral-700/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.8),0_4px_12px_rgba(59, 130, 246,0.4)] group-hover:border-[#A1A1A1] transition-colors"
        >
          {/* Glowing Crystalline Core Symbol */}
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#A1A1A1] group-hover:text-[#A1A1A1] transition-colors filter drop-shadow-[0_0_8px_rgba(59, 130, 246,0.9)]" />
          </div>
        </motion.div>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-wider uppercase bg-gradient-to-r from-white via-[#f3e8ff] to-[#A1A1A1] bg-clip-text text-transparent group-hover:from-white group-hover:via-[#A1A1A1] group-hover:to-[#3B82F6] transition-all ${sizeMap[size].text}`}
            >
              ANORIX
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#A1A1A1] bg-[#A1A1A1]/15 border border-[#A1A1A1]/30 px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(161, 161, 161,0.3)]">
              v3.0
            </span>
          </div>
          <span className="text-[10px] text-[#A1A1A1]/70 font-mono tracking-tight flex items-center gap-1 mt-1">
            <Zap className="w-2.5 h-2.5 text-[#3B82F6]" />
            Digital Architecture
          </span>
        </div>
      )}
    </div>
  );
};
