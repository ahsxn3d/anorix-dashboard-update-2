'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';

interface DashboardHoloCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
  onClick?: () => void;
}

export const DashboardHoloCard: React.FC<DashboardHoloCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glowColor = 'rgba(59, 130, 246, 0.35)',
  onClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
    if (!supportsFinePointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (supportsFinePointer) setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
      }}
      onClick={onClick}
      style={{ perspective: supportsFinePointer ? 1000 : undefined }}
      className="relative w-full select-none"
    >
      <motion.div
        animate={{ y: 0 }}
        className={`relative w-full rounded-2xl border bg-[#0a0a0a] transition-colors duration-500 border-white/10 hover:border-white/30 ${className}`}
      >
        <div className="relative z-10 w-full h-full p-4 sm:p-5">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
