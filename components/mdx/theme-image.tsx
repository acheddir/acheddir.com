'use client';

import React, { useEffect, useState } from 'react';
import AvatarHeroImage from '@/public/avatar-hero-image.jpg';
// Import the images directly
import AvatarImage from '@/public/avatar.jpg';
import { useTheme } from 'next-themes';

interface ThemeImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ThemeImage({ lightSrc, darkSrc, alt, width = 800, height = 500, className = '' }: ThemeImageProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before mounting, use a fallback
  if (!mounted) {
    return <div className="my-6 rounded-lg bg-muted" style={{ width, height }} />;
  }

  // Used fixed images for now since the dynamic path isn't working
  let imageSrc;
  const basePath = process.env.NODE_ENV === 'production' ? '' : '';

  if (lightSrc.includes('avatar.jpg') || darkSrc.includes('avatar.jpg')) {
    imageSrc = AvatarImage;
  } else if (lightSrc.includes('avatar-hero') || darkSrc.includes('avatar-hero')) {
    imageSrc = AvatarHeroImage;
  } else {
    // Fallback to a hardcoded image for testing
    imageSrc = AvatarImage;
  }

  // Choose which hardcoded image to use based on theme
  const actualSrc = resolvedTheme === 'dark' ? AvatarImage : AvatarHeroImage;

  return (
    <div className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={actualSrc.src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg ${className}`}
        style={{ maxWidth: '100%' }}
      />
      <p className="mt-1 text-xs text-muted-foreground">
        Theme: {resolvedTheme || 'loading'}, Image: {resolvedTheme === 'dark' ? darkSrc : lightSrc}
      </p>
    </div>
  );
}
