'use client'

import React from 'react';
import { motion } from 'motion/react';

export interface StatusRadarPulseProps {
  status: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE' | 'LIVE' | 'SYNCING';
  label?: string;
  sublabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusRadarPulse: React.FC<StatusRadarPulseProps> = ({
  status,
  label,
  sublabel,
  className = '',
  size = 'md',
}) => {
  const colorMap = {
    OPTIMAL: { bg: 'bg-[var(--ok-fg)]', glow: 'transparent', text: 'text-[var(--ok-fg)]', border: 'border-[var(--ok-border)]' },
    LIVE: { bg: 'bg-[var(--ok-fg)]', glow: 'transparent', text: 'text-[var(--ok-fg)]', border: 'border-[var(--ok-border)]' },
    SYNCING: { bg: 'bg-[var(--warn-fg)]', glow: 'transparent', text: 'text-[var(--warn-fg)]', border: 'border-[var(--warn-border)]' },
    DEGRADED: { bg: 'bg-[var(--err-fg)]', glow: 'transparent', text: 'text-[var(--err-fg)]', border: 'border-[var(--err-border)]' },
    MAINTENANCE: { bg: 'bg-[var(--neu-fg)]', glow: 'transparent', text: 'text-[var(--neu-fg)]', border: 'border-[var(--neu-border)]' },
  };

  const current = colorMap[status] || colorMap.OPTIMAL;

  const sizeClasses = {
    sm: 'px-2 py-1 gap-2 text-[10px]',
    md: 'px-3 py-1.5 gap-2.5 text-[11px]',
    lg: 'px-3.5 py-2 gap-3 text-xs',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-transparent border border-[#232323] ${sizeClasses[size]} ${className}`}
    >
      {/* Concentric Radar Rings */}
      <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
        <motion.span
          animate={{ opacity: 1 }}
          className={`absolute w-full h-full rounded-full ${current.bg} opacity-0`}
        />
        <span
          className={`relative w-2 h-2 rounded-full ${current.bg}`}
          style={{ boxShadow: `0 0 8px ${current.glow}` }}
        />
      </div>

      <div className="flex flex-col min-w-0">
        <span className={`font-mono font-bold tracking-wider uppercase truncate ${current.text}`}>
          {label || status}
        </span>
        {sublabel && (
          <span className="text-[9px] font-mono text-slate-400 leading-none truncate">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
