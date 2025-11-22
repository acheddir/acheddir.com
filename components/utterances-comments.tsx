'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface UtterancesCommentsProps {
  repo: string;
  issueTerm?: 'pathname' | 'url' | 'title' | 'og:title';
  label?: string;
}

export function UtterancesComments({ repo, issueTerm = 'pathname', label }: UtterancesCommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Map next-themes to Utterances theme names
  const utterancesTheme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';

  // Only mount once on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial load: create the Utterances script only once after mounting
  useEffect(() => {
    if (!mounted) return;

    const container = commentsRef.current;
    if (!container) return;

    // Check if utterances is already loaded in this container
    if (container.querySelector('.utterances, .utterances-frame')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    script.setAttribute('issue-term', issueTerm);
    script.setAttribute('theme', utterancesTheme);
    if (label) {
      script.setAttribute('label', label);
    }
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);
  }, [mounted, repo, issueTerm, label]); // utterancesTheme intentionally excluded to prevent recreation

  // Handle theme changes by sending message to existing iframe
  useEffect(() => {
    if (!commentsRef.current) return;

    const iframe = commentsRef.current.querySelector<HTMLIFrameElement>('iframe.utterances-frame');
    if (iframe) {
      const message = {
        type: 'set-theme',
        theme: utterancesTheme,
      };
      iframe.contentWindow?.postMessage(message, 'https://utteranc.es');
    }
  }, [utterancesTheme]);

  return <div ref={commentsRef} />;
}
