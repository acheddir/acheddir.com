'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

import { siteMetadata, defaultAuthor } from '@/lib/metadata';
import { cn, debounce } from '@/lib/utils';
import { AnnouncementBar } from '@/components/announcement-bar';
import { CommandDialogComponent } from '@/components/command-dialog';
import { MobileNav } from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Navbar } from '@/components/navbar';
import { WorkAvailabilityBadge } from '@/components/work-availability-badge';
import i18next from '@/app/i18n/i18next';

import { LocaleToggle } from './locale-toggle';

import Avatar from '@/public/avatar.jpg';

const SCROLL_OFFSET = 200;

interface NavigationProps {
  locale: string;
}

export function Navigation({ locale }: NavigationProps) {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const isRtl = i18next.dir(locale) === 'rtl';

  const handleScroll = useCallback(
    () =>
      debounce(() => {
        const currentScrollPos = window.scrollY;

        if ((prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70) || currentScrollPos < 10) {
          setVisible(true);
        } else {
          setVisible(false);
        }

        setPrevScrollPos(currentScrollPos);
      }, 100),
    [prevScrollPos, setPrevScrollPos, setVisible]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <>
      {siteMetadata?.activeAnnouncement && (
        <AnnouncementBar
          buttonText={siteMetadata.announcement.buttonText as string}
          link={siteMetadata.announcement.link as string}
        >
          <Rocket className="mr-2 h-5 w-5" />
          <strong className="mr-1">Launching on DevHunt!</strong> If you like this template, please support me by
          upvoting on DevHunt from Aug 21-27.
        </AnnouncementBar>
      )}
      <header
        className={cn(
          'fixed inset-x-0 -bottom-32 z-20 mx-auto mb-4 px-4 transition-all duration-1000 animate-out sm:top-0 sm:h-16 sm:px-0 sm:transition-none',
          visible && 'bottom-0 animate-in',
          siteMetadata.activeAnnouncement && 'sm:top-28 md:top-20 lg:top-12'
        )}
      >
        {defaultAuthor.availableForWork && (
          <div className="mx-auto mb-2 text-center sm:hidden">
            <Link href="/now" aria-label="Go to Now page">
              <WorkAvailabilityBadge />
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2 rounded-full border-b border-foreground/25 bg-background/95 px-3 py-2 shadow-md supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:bg-clip-padding supports-[backdrop-filter]:backdrop-blur sm:justify-between sm:rounded-none sm:px-3">
          <div className="container mx-auto flex max-w-6xl">
            <div className="flex items-center justify-start">
              <div
                className={cn('group aspect-square h-auto w-10 overflow-hidden rounded-full border border-black', {
                  'mr-4': !isRtl,
                  'ml-4': isRtl,
                })}
              >
                <Link href={`/${locale}`} aria-label="Go to Home">
                  <Image
                    className="duration-300 group-hover:scale-110"
                    width={40}
                    height={40}
                    src={Avatar}
                    alt={defaultAuthor.name}
                  />
                </Link>
              </div>
              {defaultAuthor.availableForWork && (
                <Link href="/now" aria-label="Go to Now page" className="ml-2 hidden sm:block">
                  <WorkAvailabilityBadge />
                </Link>
              )}
            </div>
            <div
              className={cn('order-3 sm:order-2', {
                'sm:mr-auto': !isRtl,
                'sm:ml-auto': isRtl,
              })}
            >
              <nav className="ml-auto hidden space-x-6 text-sm font-medium sm:block sm:w-full">
                <Navbar locale={locale} />
              </nav>
              <nav className="sm:hidden">
                <MobileNav locale={locale} />
              </nav>
            </div>
            <div className="order-2 flex w-full items-center gap-2 sm:order-3 sm:w-fit">
              <CommandDialogComponent locale={locale} />
              <ModeToggle />
              <LocaleToggle locale={locale} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
