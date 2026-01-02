'use client';

import * as React from 'react';
import Link from 'next/link';
import { Radar } from 'lucide-react';

import { cn } from '@/lib/utils';
import i18next from '@/app/i18n/i18next';

interface TechnologyRadarProps {
  locale: string;
  title: string;
  subtitle: string;
  url: string;
}

export function TechnologyRadar({ locale, title, subtitle, url }: TechnologyRadarProps) {
  const isRtl = i18next.dir(locale) === 'rtl';

  return (
    <div className="container max-w-6xl py-8">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
      >
        <Radar
          className={cn('h-12 w-12 text-primary transition-transform group-hover:scale-110', {
            'order-2': isRtl,
          })}
        />
        <div
          className={cn('flex flex-col', {
            'text-right': isRtl,
            'text-left': !isRtl,
          })}
        >
          <span className="text-lg font-semibold text-foreground">{title}</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            {subtitle}{' '}
            <img
              src="https://www.thoughtworks.com/etc.clientlibs/thoughtworks/clientlibs/clientlib-site/resources/images/thoughtworks-logo.svg"
              alt="ThoughtWorks"
              className="inline-block h-4"
            />
          </span>
        </div>
      </Link>
    </div>
  );
}
