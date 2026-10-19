'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface KineticHeroTitleProps {
  line1?: string;
  line2?: string;
  line3?: string;
  className?: string;
  restartKey?: string | number;
  scrollTrigger?: boolean;
  triggerOnce?: boolean;
}

const HACKER_GLYPHS = 'ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~_0101XYZΔΨΩ';

export const KineticHeroTitle: React.FC<KineticHeroTitleProps> = ({
  line1 = "CYBERNETiC CRAFT",
  line2 = "DiGiTAL REALMS",
  line3 = "ENGiNEERED.",
  className = "",
  restartKey,
  scrollTrigger = true,
  triggerOnce = false,
}) => {
  const [activeLine1, setActiveLine1] = useState(line1);
  const [activeLine2, setActiveLine2] = useState(line2);
  const [activeLine3, setActiveLine3] = useState(line3);
  const [isScrambling, setIsScrambling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const startScramble = useCallback(() => {
    setIsScrambling(true);
    let iteration = 0;
    const sLine1 = line1 || '';
    const sLine2 = line2 || '';
    const sLine3 = line3 || '';
    const maxLen = Math.max(sLine1.length, sLine2.length, sLine3.length);
    const stepIncrement = Math.max(1, maxLen / 12);

    const interval = setInterval(() => {
      const solved = Math.floor(iteration * stepIncrement);

      setActiveLine1(
        sLine1
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < solved ? c : HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)]))
          .join('')
      );
      setActiveLine2(
        sLine2
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < solved ? c : HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)]))
          .join('')
      );
      setActiveLine3(
        sLine3
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < solved ? c : HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)]))
          .join('')
      );

      if (solved >= maxLen) {
        clearInterval(interval);
        setIsScrambling(false);
        setActiveLine1(line1);
        setActiveLine2(line2);
        setActiveLine3(line3);
      }

      iteration++;
    }, 20);

    const failsafe = setTimeout(() => {
      clearInterval(interval);
      setIsScrambling(false);
      setActiveLine1(line1);
      setActiveLine2(line2);
      setActiveLine3(line3);
    }, 380);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
    };
  }, [line1, line2, line3]);

  // Scroll Trigger via IntersectionObserver
  useEffect(() => {
    if (!scrollTrigger || !containerRef.current) {
      const cleanup = startScramble();
      return () => cleanup && cleanup();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!triggerOnce || !hasTriggeredRef.current) {
              hasTriggeredRef.current = true;
              startScramble();
            }
          } else if (!triggerOnce) {
            hasTriggeredRef.current = false;
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [scrollTrigger, triggerOnce, startScramble]);

  useEffect(() => {
    if (restartKey !== undefined) {
      hasTriggeredRef.current = true;
      startScramble();
    }
  }, [restartKey, startScramble]);

  const renderLine = (text: string, originalText: string, lineIndex: number) => {
    const sText = text || '';
    const sOrig = originalText || '';
    return sText.split('').map((char, i) => {
      const isSpecial = char === 'i' || char === 'T' || char === '.' || char === '1' || char === '4';
      const isSpace = char === ' ';
      const isSolved = char === sOrig[i];

      if (isSpace) {
        return <span key={`${lineIndex}-${i}`} className="inline-block w-2 sm:w-4">&nbsp;</span>;
      }

      return (
        <span
          key={`${lineIndex}-${i}`}
          className={`inline-block font-black select-none tracking-tighter origin-center font-mono transition-colors duration-75 ${
            !isSolved
              ? 'text-[#A1A1A1] drop-shadow-[0_0_12px_rgba(59, 130, 246,0.9)] animate-pulse'
              : isSpecial
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-neutral-800 to-neutral-800'
              : 'text-white'
          }`}
          style={{
            textShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (!isScrambling) startScramble();
      }}
      className={`flex flex-col select-none cursor-pointer ${className}`}
    >
      {line1 && (
        <div className="flex flex-wrap items-center justify-start text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none py-1">
          {renderLine(activeLine1, line1, 1)}
        </div>
      )}
      {line2 && (
        <div className="flex flex-wrap items-center justify-start text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none py-1">
          {renderLine(activeLine2, line2, 2)}
        </div>
      )}
      {line3 && (
        <div className="flex flex-wrap items-center justify-start text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none py-1">
          {renderLine(activeLine3, line3, 3)}
        </div>
      )}
    </div>
  );
};
