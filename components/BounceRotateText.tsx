'use client'

import React from 'react';
import { motion } from 'motion/react';

interface BounceRotateTextProps {
  text: string;
  className?: string;
  mode?: 'letters' | 'words';
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  maxRotate?: number;
  highlightClass?: string;
  highlightWords?: string[];
  gradientText?: boolean;
  enableSound?: boolean;
  scrollTrigger?: boolean;
  triggerOnce?: boolean;
}

export const BounceRotateText: React.FC<BounceRotateTextProps> = ({
  text,
  className = '',
  mode = 'letters',
  delay = 0,
  stagger = 0.03,
  as: Component = 'span',
  maxRotate = 14,
  highlightClass = 'text-transparent bg-clip-text bg-gradient-to-r from-[#A1A1A1] via-[#A1A1A1] to-[#A1A1A1]',
  highlightWords = [],
  gradientText = false,
  scrollTrigger = true,
  triggerOnce = true,
}) => {
  if (!text) return null;

  if (mode === 'words') {
    const words = text.split(' ');

    return (
      <Component className={`inline-flex flex-wrap gap-x-1.5 gap-y-0.5 items-center ${className}`}>
        {words.map((word, i) => {
          const isHighlighted = (highlightWords || []).some(
            (hw) => (hw || '').toLowerCase() === (word || '').toLowerCase().replace(/[^a-z0-9]/gi, '')
          );
          const rotationAngle = (i % 2 === 0 ? 1 : -1) * maxRotate;

          return (
            <motion.span
              key={`${word}-${i}`}
              initial={{
                opacity: 0,
                scale: 0.15,
                y: -30,
                rotate: rotationAngle * 1.6,
              }}
              {...(scrollTrigger
                ? {
                    whileInView: { opacity: 1, scale: 1, y: 0, rotate: 0 },
                    viewport: { once: triggerOnce, margin: '-20px' },
                  }
                : {
                    animate: { opacity: 1, scale: 1, y: 0, rotate: 0 },
                  })}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 14,
                mass: 0.75,
                delay: delay + i * stagger,
              }}
              className={`inline-block font-inherit origin-center ${
                isHighlighted || gradientText ? highlightClass : ''
              }`}
            >
              {word}
            </motion.span>
          );
        })}
      </Component>
    );
  }

  // Letter mode (per-character grow, bounce, and rotate on-load/on-scroll)
  const characters = text.split('');

  return (
    <Component className={`inline-block ${className}`}>
      {characters.map((char, i) => {
        if (char === ' ') {
          return (
            <span key={i} className="inline-block w-[0.28em]">
              &nbsp;
            </span>
          );
        }

        const rotationAngle = (i % 2 === 0 ? 1 : -1) * (maxRotate + (i % 3) * 3);

        return (
          <motion.span
            key={i}
            initial={{
              opacity: 0,
              scale: 0.1,
              y: -32,
              rotate: rotationAngle,
            }}
            {...(scrollTrigger
              ? {
                  whileInView: { opacity: 1, scale: 1, y: 0, rotate: 0 },
                  viewport: { once: triggerOnce, margin: '-20px' },
                }
              : {
                  animate: { opacity: 1, scale: 1, y: 0, rotate: 0 },
                })}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 13,
              mass: 0.7,
              delay: delay + i * stagger,
            }}
            className={`inline-block origin-center font-inherit ${
              gradientText ? highlightClass : ''
            }`}
          >
            {char}
          </motion.span>
        );
      })}
    </Component>
  );
};
