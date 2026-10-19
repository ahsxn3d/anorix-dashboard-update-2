'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';

interface CyberButtonProps {
  variant?: 'primary' | 'secondary' | 'emerald' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  id?: string;
  'aria-label'?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!supportsFinePointer || disabled || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const distanceX = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
    const distanceY = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
    setOffset({ x: distanceX, y: distanceY });
  }, [disabled, supportsFinePointer]);

  const variants = {
    primary: 'bg-white hover:bg-[#e8e8e8] text-black border-white',
    secondary: 'bg-transparent hover:bg-white hover:text-black text-white border-white/20',
    emerald: 'bg-white hover:bg-[#e8e8e8] text-black border-white',
    danger: 'bg-transparent hover:bg-white hover:text-black text-white border-white/30',
    ghost: 'bg-transparent hover:bg-white/10 text-white/70 hover:text-white border-transparent'
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl font-bold tracking-wide gap-2',
    lg: 'px-6 py-3 text-base rounded-xl font-black tracking-wider gap-2.5'
  };

  return (
    <motion.button
      ref={btnRef}
      animate={{ x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (supportsFinePointer) setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setOffset({ x: 0, y: 0 });
      }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.95, transition: { type: 'spring', stiffness: 500, damping: 15 } }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
      id={id}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center font-mono border select-none cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {supportsFinePointer && isHovered && !disabled && (
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-800 opacity-30 blur-sm pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {children}
      </span>
    </motion.button>
  );
};
