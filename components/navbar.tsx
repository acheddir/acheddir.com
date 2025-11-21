'use client';

import * as React from 'react';
import Link from 'next/link';

import { navigationLinks } from '@/lib/navigation-links';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { useTranslation } from '@/app/i18n/client';
import i18next from '@/app/i18n/i18next';

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const { t } = useTranslation(locale, 'common');
  const isRtl = i18next.dir(locale) === 'rtl';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationLinks?.map((item) => (
          <NavigationMenuItem key={item.title.trim()}>
            {item.content ? (
              <>
                <NavigationMenuTrigger>{t(item.title)}</NavigationMenuTrigger>
                <NavigationMenuContent isRtl={isRtl}>
                  <ul className="grid w-[120px] gap-3 p-2 md:grid-cols-1">
                    {item.content.map((subItem) => (
                      <ListItem
                        key={subItem.href.trim()}
                        title={t(subItem.title)}
                        href={subItem.href.startsWith('http') ? subItem.href : `/${locale}${subItem.href}`}
                        target={subItem.href.startsWith('http') ? '_blank' : '_self'}
                      >
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={`/${locale}${item.href as string}`} legacyBehavior passHref>
                <NavigationMenuLink
                  target={item?.href?.startsWith('http') ? '_blank' : '_self'}
                  className={navigationMenuTriggerStyle()}
                >
                  {t(item.title)}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
        <NavigationMenuIndicator />
      </NavigationMenuList>
      <NavigationMenuViewport isRtl={isRtl} />
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          {/* TODO: Figure out how to type this */}
          {/* @ts-expect-error */}
          <Link
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
