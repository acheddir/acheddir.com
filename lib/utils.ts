import { Post } from '#site/content';
import { clsx, type ClassValue } from 'clsx';
import { compareDesc } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import { siteMetadata } from './metadata';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const langIcon = (lang: string, title: string): string => {
  if (lang === 'xml' && title.includes('csproj')) {
    return 'visualstudio';
  } else {
    return lang;
  }
};

export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200; // Average humans read about 200-250 words per minute.
  const noOfWords = text.split(/\s/g).length;

  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);

  return readTime;
};

export const getTagsWithCount = (posts: Post[]) =>
  posts.reduce((acc: any, post: Post) => {
    post.tags?.forEach((tag: any) => {
      if (acc[tag]) {
        acc[tag] += 1;
      } else {
        acc[tag] = 1;
      }
    });
    return acc;
  }, {});

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const sortByDate = (a: Post, b: Post) =>
  compareDesc(new Date(a.lastUpdatedDate || a.publishedDate), new Date(b.lastUpdatedDate || b.publishedDate));

export const pageCount = (number: number) => Math.ceil(number / siteMetadata.postsPerPage);

export const transformerCodeMetadata = () => {
  let rawCode: string;
  let lang: string;
  let title: string;

  return {
    preprocess(raw: string, options: any) {
      rawCode = raw;
      lang = options.lang;

      if (options.meta.__raw) {
        const match = options.meta.__raw.match(/title\s*=\s*"([^"]+)"/);
        title = match ? match[1] : undefined;

      }
    },
    pre(pre: any) {
      pre.properties['raw'] = rawCode;
      pre.properties['lang'] = lang;

      if (title) {
        pre.properties['title'] = title;
        title = '';
      }
    }
  };
};
