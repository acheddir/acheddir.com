'use client';

import { ComponentProps, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn, langIcon } from '@/lib/utils';

type CodeBlockProps = ComponentProps<'pre'> & {
  lang: string;
  title: string;
  raw?: string;
};

export function CodeBlock({ children, raw, lang, title, className, ...props }: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (raw) {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative" data-theme={theme} suppressHydrationWarning>
      <div className="flex flex-row align-middle justify-between rounded-t-lg border border-b-0 border-gray-500 bg-gray-100 px-3 py-1 dark:bg-gray-700">
        <div className="mr-1 inline-block align-middle">
          <i
            className={cn(`h-4 w-4 text-base devicon-${langIcon(lang, title)}-plain`, {
              colored: theme !== 'dark',
            })}
          ></i>
        </div>
        {title && <div className="font-heading text-base">{title}</div>}
        <button type="button" onClick={onCopy} className="transition" aria-label="Copy code">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className={`mb-4 overflow-x-auto border border-gray-500 bg-muted px-4 py-2 ${className}`} {...props}>
        {children}
      </pre>
    </div>
  );
}
