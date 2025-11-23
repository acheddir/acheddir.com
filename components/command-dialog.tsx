'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DialogProps } from '@radix-ui/react-dialog';
import { ArrowDown, ArrowUp, BookOpen, CornerDownLeft, Languages, Loader, Moon, Sun, Tag, Terminal, X } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { useAlgoliaSearch } from '@/hooks/use-algolia-search';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { AlgoliaLogo } from '@/components/algolia-logo';
import { useTranslation } from '@/app/i18n/client';
import i18next from '@/app/i18n/i18next';

interface CommandDialogProps extends DialogProps {
  locale: string;
}

interface Command {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandDialogComponent({ locale, ...props }: CommandDialogProps) {
  const { t, i18n } = useTranslation(locale, 'common');
  const isRtl = i18next.dir(locale) === 'rtl';
  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Check if the query starts with '/' for command mode
  const isCommandMode = searchQuery.startsWith('/');
  const commandQuery = isCommandMode ? searchQuery.slice(1).toLowerCase() : '';

  // Only search Algolia if not in command mode
  const { results: blogPosts, tags, isSearching } = useAlgoliaSearch(
    isCommandMode ? '' : searchQuery,
    locale
  );

  // Define available commands
  const commands: Command[] = React.useMemo(
    () => [
      {
        id: 'toggle-theme',
        name: `/toggle-theme`,
        description: t('navbar.command.toggleThemeDesc'),
        icon: theme === 'dark' ? Sun : Moon,
        action: () => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        },
      },
      {
        id: 'switch-language',
        name: `/switch-language`,
        description: t('navbar.command.switchLanguageDesc'),
        icon: Languages,
        action: () => {
          const newLocale = locale === 'en' ? 'ma' : 'en';
          const newPath = pathname?.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
          router.push(newPath);
        },
      },
    ],
    [theme, setTheme, t, i18n.resolvedLanguage, pathname, router]
  );

  // Filter commands based on the query
  const filteredCommands = React.useMemo(() => {
    if (!isCommandMode) return [];
    if (commandQuery === '') return commands;
    return commands.filter(
      (cmd) =>
        cmd.id.includes(commandQuery) ||
        cmd.name.toLowerCase().includes(commandQuery) ||
        cmd.description.toLowerCase().includes(commandQuery)
    );
  }, [isCommandMode, commandQuery, commands]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Focus and select text when dialog opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      // Use a longer timeout to ensure the dialog animation completes
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const navigate = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    } else {
      router.push(href);
    }
  };

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          'relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground md:w-32 lg:w-64',
          {
            'sm:pr-12': !isRtl,
            'sm:pl-12': isRtl,
          }
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">{t('navbar.search')}</span>
        <kbd
          className={cn(
            'pointer-events-none absolute top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex',
            {
              'right-1.5': !isRtl,
              'left-1.5': isRtl,
            }
          )}
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog isRtl={isRtl} open={open} onOpenChange={setOpen}>
        <style>{`
          [cmdk-root] mark {
            background-color: ${theme === 'dark' ? 'rgba(234, 179, 8, 0.3)' : 'rgb(254, 240, 138)'} !important;
            color: ${theme === 'dark' ? 'rgb(248, 250, 252)' : 'rgb(15, 23, 42)'} !important;
            font-weight: 600 !important;
          }
        `}</style>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            tabIndex={-1}
            className={cn(
              'group absolute top-4 z-10 flex h-8 items-center gap-1.5 text-sm opacity-70 transition-all hover:opacity-100',
              {
                'right-14': !isRtl,
                'left-14': isRtl,
              }
            )}
          >
            <span className="transition-colors group-hover:text-[#003dff] dark:group-hover:text-white">
              {t('navbar.command.clear')}
            </span>
            <span className="text-muted-foreground">|</span>
          </button>
        )}
        <CommandInput
          ref={inputRef}
          isRtl={isRtl}
          placeholder={t('navbar.command.placeholder')}
          value={searchQuery}
          onValueChange={setSearchQuery}
          autoFocus
        />
        <CommandList>
          {/* Command Mode */}
          {isCommandMode && filteredCommands.length > 0 && (
            <CommandGroup heading={t('navbar.command.commands')}>
              {filteredCommands.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.id}
                    onSelect={() => {
                      runCommand(command.action);
                    }}
                  >
                    <Icon className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-slate-900 dark:text-slate-50">{command.name}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{command.description}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Command Mode - No Results */}
          {isCommandMode && filteredCommands.length === 0 && (
            <CommandEmpty>{t('navbar.command.noResults')}</CommandEmpty>
          )}

          {/* Search Mode - Loading */}
          {!isCommandMode && searchQuery.length >= 2 && isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Search Mode - No Results */}
          {!isCommandMode && searchQuery.length >= 2 && !isSearching && blogPosts.length === 0 && tags.length === 0 && (
            <CommandEmpty>{t('navbar.command.noResults')}</CommandEmpty>
          )}

          {/* Search Mode - Blog Posts */}
          {!isCommandMode && blogPosts.length > 0 && (
            <CommandGroup heading={t('navbar.posts') || 'Blog Posts'}>
              {blogPosts.map((post) => (
                <CommandItem
                  key={post.objectID}
                  onSelect={() => {
                    runCommand(() => navigate(`/${locale}/posts/${post.slug}`));
                  }}
                >
                  <BookOpen className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                  <div className="flex flex-col">
                    <span
                      className="text-base font-medium text-slate-900 dark:text-slate-50"
                      dangerouslySetInnerHTML={{
                        __html: post._highlightResult?.title?.value || post.title,
                      }}
                    />
                    {post.description && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {post.description.substring(0, 80)}
                        {post.description.length > 80 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search Mode - Tags */}
          {!isCommandMode && tags.length > 0 && (
            <CommandGroup heading={t('navbar.tags') || 'Tags'}>
              {tags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => {
                    runCommand(() => navigate(`/${locale}/tags/${tag}`));
                  }}
                >
                  <Tag className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                  <span className="text-base text-slate-900 dark:text-slate-50">{tag}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <div className="flex items-center justify-between border-t p-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <span>{t('navbar.command.navigate')}</span>
              </div>
              <div className="flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" />
                <span>{t('navbar.command.select')}</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="rounded border px-1 text-[10px]">esc</kbd>
                <span>{t('navbar.command.close')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('navbar.command.poweredBy')}</span>
              <AlgoliaLogo />
            </div>
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}
