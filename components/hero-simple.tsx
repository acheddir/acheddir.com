'use client';

import * as React from 'react';
import Image from 'next/image';

import { defaultAuthor } from '@/lib/metadata';
import { cn } from '@/lib/utils';
import i18next from '@/app/i18n/i18next';

import Avatar from '@/public/avatar.jpg';

interface HeroProps {
  locale: string;
  title: string;
  subtitle?: string;
}

export function HeroSimple({ locale, title, subtitle }: HeroProps) {
  const isRtl = i18next.dir(locale) === 'rtl';

  return (
    <div className="container flex max-w-5xl flex-col items-center justify-center text-center sm:py-16 md:py-20">
      <h1 className="font-heading mb-2 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <h6 className="font-heading text-md mb-2 font-bold leading-tight tracking-tight sm:text-lg md:text-xl">
        {subtitle}
      </h6>
      <div className="flex content-center items-center justify-center">
        <Image
          className="aspect-square h-10 w-10 rounded-full border border-black"
          width={40}
          height={40}
          src={Avatar}
          alt={defaultAuthor.name}
        />
        <p
          dir="ltr"
          className={cn('font-bold text-muted-foreground', {
            'ml-2': !isRtl,
            'mr-2': isRtl,
          })}
        >
          {defaultAuthor.handle}
        </p>
      </div>
    </div>
  );
}
