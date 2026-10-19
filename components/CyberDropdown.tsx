'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';

export interface CyberDropdownOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CyberDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: (T | CyberDropdownOption<T>)[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export function CyberDropdown<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  disabled = false,
  size = 'md',
  id
}: CyberDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: CyberDropdownOption<T>[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt as T, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    try {
      sound?.playClick?.();
    } catch {
      // ignore
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (val: T) => {
    try {
      sound?.playClick?.();
    } catch {
      // ignore
    }
    onChange(val);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2.5 text-xs',
    lg: 'px-4 py-3 text-sm'
  };

  return (
    <div
      ref={containerRef}
      id={id || 'cyber-dropdown-container'}
      className={`relative w-full ${className}`}
    >
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 rounded-xl bg-[#171717] border transition-all duration-200 text-left font-mono ${
          isOpen
            ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/30 shadow-[0_0_15px_rgba(59, 130, 246,0.25)] bg-[#171717]'
            : 'border-white/10 hover:border-neutral-700/40 hover:bg-[#171717]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
          sizeClasses[size]
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="text-neutral-300">{selectedOption.icon}</span>
          )}
          <span className="truncate font-semibold tracking-wide text-white">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-800/20 text-neutral-300 border border-neutral-700/30">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-neutral-300 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-neutral-300' : ''
          }`}
        />
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#0f0521] border border-neutral-700/30 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(59, 130, 246,0.15)] backdrop-blur-xl overflow-hidden py-1.5 max-h-60 overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
            role="listbox"
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-mono text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#3B82F6]/30 to-neutral-800/20 text-white font-bold border-l-2 border-[#3B82F6]'
                      : 'text-slate-300 hover:bg-neutral-800/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && (
                      <span className={isSelected ? 'text-[#A1A1A1]' : 'text-slate-400'}>
                        {opt.icon}
                      </span>
                    )}
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-800/20 text-neutral-300">
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#A1A1A1] shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
