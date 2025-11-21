'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FlattenedTocEntry, PostHeading, TocEntry } from '@/types';

import { cn } from '@/lib/utils';

interface TocProps {
  toc: TocEntry[];
}

function flattenToc(
  toc: TocEntry[],
  currentLevel: number = 1
): FlattenedTocEntry[] {
  return toc.flatMap(entry => [
    { title: entry.title, url: entry.url, level: currentLevel },
    ...flattenToc(entry.items, currentLevel + 1)
  ]);
}

export function TableOfContents({ toc }: TocProps) {
  const [activeSlug, setActiveSlug] = useState<string>('');

  const chapters = flattenToc(toc);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: any) => {
        entries.forEach((entry: any) => {
          if (entry?.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px',
      }
    );

    chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.url.replace('#', ''));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav className="flex items-center self-start" aria-label="Table of Contents">
      <ol className="list-none space-y-3">
        {chapters.map((entry: FlattenedTocEntry) => (
          <li
            key={entry.url}
            className={cn(
              'list-none text-sm font-bold transition-colors duration-200 ease-in-out hover:text-accent-foreground',
              entry.level === 2 && 'ml-6 font-normal',
              entry.level === 3 && 'ml-8 font-normal',
              entry.level === 4 && 'ml-10 font-normal',
              activeSlug === entry.url.replace('#', '') && 'text-accent-foreground'
            )}
          >
            <Link href={`${entry.url}`}>{entry.title}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
