'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

export interface PhysicsTensionSliderProps {
  tension: number;
  damping: number;
  onTensionChange: (val: number) => void;
  onDampingChange: (val: number) => void;
  className?: string;
}

export const PhysicsTensionSlider: React.FC<PhysicsTensionSliderProps> = ({
  tension,
  damping,
  onTensionChange,
  onDampingChange,
  className = '',
}) => {
  const [testToggle, setTestToggle] = useState(false);

  return (
    <div className={`p-4 rounded-xl bg-[#0A0A0A] border border-neutral-700/25 space-y-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" />
          <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
            Spring Kinematics Calibrator
          </span>
        </div>
        <button
          type="button"
          onClick={() => setTestToggle(!testToggle)}
          className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg bg-neutral-800/30 text-neutral-300 border border-neutral-700/40 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          {testToggle ? <RotateCcw className="w-3 h-3 text-neutral-300" /> : <Play className="w-3 h-3 text-neutral-300" />}
          Trigger Pulse
        </button>
      </div>

      {/* Live Interactive Physics Preview Node */}
      <div className="h-20 flex items-center justify-center bg-black/50 rounded-xl border border-neutral-700/15 overflow-hidden relative shadow-inner">
        {/* Grid Background Guideline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Center line marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-800/20" />

        <motion.div
          animate={{
            x: testToggle ? 90 : -90,
            rotate: testToggle ? 180 : 0,
            scale: testToggle ? 1.15 : 0.95,
          }}
          transition={{
            type: 'spring',
            stiffness: tension,
            damping: damping,
          }}
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-800 shadow-[0_0_25px_rgba(59, 130, 246,0.6)] flex flex-col items-center justify-center font-mono font-black text-xs text-white z-10 cursor-pointer border border-white/20 select-none"
          onClick={() => setTestToggle(!testToggle)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-[10px] opacity-75 leading-none">k:</span>
          <span>{tension}</span>
        </motion.div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
          <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1.5">
            <span>Tension (Stiffness):</span>
            <span className="text-neutral-300 font-bold font-mono">{tension}</span>
          </div>
          <input
            type="range"
            min={100}
            max={600}
            step={10}
            value={tension}
            onChange={(e) => onTensionChange(Number(e.target.value))}
            className="w-full accent-neutral-800 cursor-pointer h-2 bg-neutral-800/60 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>100 (Soft)</span>
            <span>600 (Snappy)</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
          <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1.5">
            <span>Damping (Friction):</span>
            <span className="text-neutral-300 font-bold font-mono">{damping}</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={1}
            value={damping}
            onChange={(e) => onDampingChange(Number(e.target.value))}
            className="w-full accent-neutral-800 cursor-pointer h-2 bg-neutral-800/60 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>10 (Bouncy)</span>
            <span>60 (Overdamped)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
