'use client'

import React, { useEffect } from 'react';

interface CyberScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  cycles?: number;
  characters?: string;
  triggerOnMount?: boolean;
  triggerOnView?: boolean;
  triggerOnHover?: boolean;
  triggerKey?: string | number;
  onComplete?: () => void;
}

export const CyberScrambleText: React.FC<CyberScrambleTextProps> = ({
  text,
  className = '',
  onComplete,
}) => {
  useEffect(() => {
    onComplete?.();
  }, [text]);

  return <span className={className}>{text}</span>;
};

export default CyberScrambleText;
