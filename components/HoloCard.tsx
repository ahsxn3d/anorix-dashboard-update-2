'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '@/lib/sound';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  enableSound?: boolean;
  onClick?: () => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  children,
  className = '',
  maxTilt = 18,
  glareOpacity = 0.35,
  enableSound = false,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setSupportsFinePointer(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setSupportsFinePointer(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const animFrameRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!supportsFinePointer || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    animFrameRef.current = requestAnimationFrame(() => {
      const xPct = (clientX - rect.left) / rect.width - 0.5;
      const yPct = (clientY - rect.top) / rect.height - 0.5;

      const rotX = -yPct * maxTilt;
      const rotY = xPct * maxTilt;
      const gX = (xPct + 0.5) * 100;
      const gY = (yPct + 0.5) * 100;

      setTilt({ rotateX: rotX, rotateY: rotY, glareX: gX, glareY: gY });
    });
  }, [maxTilt, supportsFinePointer]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (supportsFinePointer) {
      setIsHovered(true);
      if (enableSound) sound.playHoverTick();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div style={{ perspective: supportsFinePointer ? 1200 : undefined }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX: supportsFinePointer && isHovered ? tilt.rotateX : 0,
          rotateY: supportsFinePointer && isHovered ? tilt.rotateY : 0,
          scale: supportsFinePointer && isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 25,
          mass: 0.5,
        }}
        whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 500, damping: 15 } }}
        className={`relative w-full h-full rounded-2xl border bg-[#111111] transition-colors duration-300 select-none overflow-hidden ${
          supportsFinePointer ? '[transform-style:preserve-3d]' : ''
        } ${
          isHovered
            ? 'border-neutral-700/60 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(59, 130, 246,0.35)]'
            : 'border-neutral-700/20 shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
        } ${className}`}
      >
        {/* Specular Dynamic Light Glare */}
        {supportsFinePointer && isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4) 0%, rgba(59, 130, 246,0.2) 25%, transparent 60%)`,
            }}
          />
        )}

        {/* Content with 3D Z-Depth Layering */}
        <div className={`relative z-10 w-full h-full ${supportsFinePointer ? '[transform-style:preserve-3d]' : ''}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
