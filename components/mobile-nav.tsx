'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileLinkProps } from '@/types';
import { Menu } from 'lucide-react';

import { siteMetadata, defaultAuthor } from '@/lib/metadata';
import { navigationLinks } from '@/lib/navigation-links';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/app/i18n/client';
import i18next from '@/app/i18n/i18next';

interface MobileNavProps {
  locale: string;
}

export function MobileNav({ locale }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation(locale, 'common');
  const isRtl = i18next.dir(locale) === 'rtl';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden',
            {
              'ml-2': !isRtl,
              'mr-2': isRtl,
            }
          )}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        isRtl={isRtl}
        side="bottom"
        className={cn({
          'pr-0': !isRtl,
          'pl-0': isRtl,
        })}
      >
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen} aria-label="Go to Home">
          <span className="font-bold">{t(siteMetadata.title.default, { name: t(defaultAuthor.name) })}</span>
        </MobileLink>
        <ScrollArea isRtl={isRtl} className="my-4 max-h-96 overflow-y-scroll pb-10">
          <div className="flex flex-col space-y-3">
            {navigationLinks?.map((item) =>
              item.content ? (
                <div className="order-1 mt-3 flex flex-col space-y-3" key={item.title.trim()}>
                  <p className="font-bold">{t(item.title)}</p>
                  {item.content.map((subItem) => (
                    <MobileLink key={subItem.href} href={subItem.href} onOpenChange={setOpen}>
                      {t(subItem.title)}
                    </MobileLink>
                  ))}
                </div>
              ) : (
                <MobileLink key={item.href} href={item.href as string} onOpenChange={setOpen}>
                  {t(item.title)}
                </MobileLink>
              )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const pathname = usePathname();
  if (href.toString().startsWith('http')) {
    return (
      <a
        href={href.toString()}
        onClick={() => {
          onOpenChange?.(false);
        }}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className)}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn(
        className,
        href.toString() !== '/' &&
          pathname.substring(2).startsWith(href.toString().substring(2)) &&
          'font-semibold text-accent-foreground'
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
