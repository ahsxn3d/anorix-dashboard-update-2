'use client';

import React, { useEffect } from 'react';

interface TextHackerScrambleProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  resolveSpeed?: number;
  characters?: string;
  autoStart?: boolean;
  scrollTrigger?: boolean;
  triggerOnce?: boolean;
  hoverToScramble?: boolean;
  restartKey?: string | number;
  highlightClass?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  onComplete?: () => void;
}

export const TextHackerScramble: React.FC<TextHackerScrambleProps> = ({
  text,
  className = '',
  as: Component = 'span',
  onComplete,
}) => {
  useEffect(() => {
    onComplete?.();
  }, [text]);

  return <Component className={className}>{text}</Component>;
};

export default TextHackerScramble;
