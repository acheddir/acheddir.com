'use client';

import { useEffect } from 'react';

interface DisqusCommentsProps {
  shortname: string;
  config: {
    url: string;
    identifier: string;
    title: string;
    language: string;
  };
}

export function DisqusComments({ shortname, config }: DisqusCommentsProps) {
  useEffect(() => {
    // Reset Disqus if it's already loaded
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = config.url;
          this.page.identifier = config.identifier;
          this.page.title = config.title;
          this.language = config.language;
        },
      });
    } else {
      // Load Disqus for the first time
      window.disqus_config = function () {
        this.page.url = config.url;
        this.page.identifier = config.identifier;
        this.page.title = config.title;
        this.language = config.language;
      };

      const script = document.createElement('script');
      script.src = `https://${shortname}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', Date.now().toString());
      document.body.appendChild(script);
    }
  }, [shortname, config]);

  return (
    <div>
      <div id="disqus_thread" />
    </div>
  );
}

// Type declarations for Disqus
interface DisqusConfig {
  page: {
    url: string;
    identifier: string;
    title: string;
  };
  language: string;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config: (this: DisqusConfig) => void }) => void;
    };
    disqus_config?: (this: DisqusConfig) => void;
  }
}
