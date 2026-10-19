'use client'

import React from 'react';

interface PlayfulLogoProps {
  onClick?: () => void;
  className?: string;
  brandText?: string;
  autoPlay?: boolean;
  interval?: number;
}

export const PlayfulLogo: React.FC<PlayfulLogoProps> = ({
  onClick,
  className = '',
  brandText = 'ANORIX',
}) => {
  const label = brandText
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[15px] tracking-[-0.04em] text-white hover:opacity-60 transition-opacity duration-500 cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};

export default PlayfulLogo;
