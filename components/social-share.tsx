"use client";

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { siFacebook, siLinkedin, siX, siYcombinator } from 'simple-icons';

import { Button, ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/app/i18n/client';
import i18next from '@/app/i18n/i18next';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  locale: string,
  url: string;
  text?: string;
}
export const SocialShare = ({ locale, url, text }: SocialShareProps) => {
  const { t } = useTranslation(locale, 'posts');

  const direction = i18next.dir(locale);
  const isRtl = direction === 'rtl';

  const encodedUrl = encodeURIComponent(url);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t('post.share')}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel dir={direction}>{t('post.sharepost')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem dir={direction} asChild>
          <Link
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              className={cn('h-3 w-3', {
                'mr-2': !isRtl,
                'ml-2': isRtl
              })}
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={siX.path}></path>
            </svg>
            Twitter
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem dir={direction} asChild>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              className={cn('h-3 w-3', {
                'mr-2': !isRtl,
                'ml-2': isRtl
              })}
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={siFacebook.path}></path>
            </svg>
            Facebook
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem dir={direction} asChild>
          <Link
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              className={cn('h-3 w-3', {
                'mr-2': !isRtl,
                'ml-2': isRtl
              })}
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={siLinkedin.path}></path>
            </svg>
            LinkedIn
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem dir={direction} asChild>
          <Link
            href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              className={cn('h-3 w-3', {
                'mr-2': !isRtl,
                'ml-2': isRtl
              })}
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={siYcombinator.path}></path>
            </svg>
            Hacker News
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem dir={direction} asChild>
          <Link
            href={`mailto:info@example.com?&subject=&cc=&bcc=&body=${encodedUrl}%20${text}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Mail
              className={cn('h-3 w-3', {
                'mr-2': !isRtl,
                'ml-2': isRtl
              })} />
            Email
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
