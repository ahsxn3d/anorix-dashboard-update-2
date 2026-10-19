'use client'

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { sound } from '@/lib/sound';

interface ButterButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'emerald' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  isMagnetic?: boolean;
  enableSound?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  id?: string;
  'aria-label'?: string;
}

export const ButterButton: React.FC<ButterButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isMagnetic = true,
  enableSound = true,
  children,
  onClick,
  onMouseEnter,
  className = '',
  disabled,
  type,
  title,
  id,
  'aria-label': ariaLabel,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMagnetic || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.28;
    const distanceY = (e.clientY - centerY) * 0.28;
    setOffset({ x: distanceX, y: distanceY });
  }, [isMagnetic]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    if (enableSound) {
      sound.playHoverTick();
    }
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound) {
      sound.playChime();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary: 'bg-white hover:bg-[#e8e8e8] text-black border border-white',
    purple: 'bg-white hover:bg-[#e8e8e8] text-black border border-white',
    secondary: 'bg-transparent hover:bg-white hover:text-black text-white border border-white/20',
    emerald: 'bg-white hover:bg-[#e8e8e8] text-black border border-white',
    cyan: 'bg-transparent hover:bg-white hover:text-black text-white border border-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-white/70 hover:text-white border border-transparent'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl font-bold tracking-wide',
    lg: 'px-7 py-3.5 text-base rounded-2xl font-black tracking-wider'
  };

  return (
    <motion.button
      ref={btnRef}
      animate={{ x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      title={title}
      id={id}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center font-mono select-none cursor-pointer transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
