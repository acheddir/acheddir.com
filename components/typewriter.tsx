'use client';

import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  children: string;
  speed?: number; // duration per character in seconds
}

export const Typewriter: React.FC<TypewriterProps> = ({ children, speed = 0.1 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText(''); // Reset on mount or children change
    
    const intervalId = setInterval(() => {
      setDisplayedText(children.slice(0, index + 1));
      index++;
      if (index >= children.length) {
        clearInterval(intervalId);
      }
    }, speed * 1000);

    return () => clearInterval(intervalId);
  }, [children, speed]);

  return (
    <span aria-label={children}>
      <span aria-hidden="true">{displayedText}</span>
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.4,
          ease: 'linear',
        }}
        className="inline-block font-mono font-normal -ml-1 text-[0.9em] align-baseline"
      >
        |
      </motion.span>
    </span>
  );
};
