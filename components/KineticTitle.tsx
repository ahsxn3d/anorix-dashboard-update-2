'use client'

import React from 'react';

interface KineticTitleProps {
  text: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  scrambleOnMount?: boolean;
  scrollTrigger?: boolean;
  triggerOnce?: boolean;
  restartKey?: string | number;
}

export const KineticTitle: React.FC<KineticTitleProps> = ({
  text = '',
  className = '',
  size = 'lg',
}) => {
  const sizeClasses = {
    xs: 'text-sm sm:text-base tracking-[-0.03em]',
    sm: 'text-base sm:text-lg tracking-[-0.03em]',
    md: 'text-xl sm:text-2xl tracking-[-0.04em]',
    lg: 'text-2xl sm:text-4xl tracking-[-0.045em]',
    xl: 'text-3xl sm:text-5xl md:text-6xl tracking-[-0.045em]',
  };

  return (
    <div className={`text-white font-medium ${sizeClasses[size]} ${className}`}>
      {text}
    </div>
  );
};

export default KineticTitle;
