import { LinkProps } from 'next/link';
import { Post } from '#site/content';

import { AnnouncementBarProps } from '@/components/announcement-bar';

export interface PostHeading {
  heading: number;
  text: string;
  slug: string;
}

export interface NavItem {
  title: string;
  href?: string;
  description?: string;
  content?: ContentNavItem[];
}

export interface ContentNavItem extends NavItem {
  href: string;
}

export interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export type AnalyticsProvider = 'umami' | 'vercel' | 'plausible' | 'google';

export type NewsletterProvider = 'convertkit' | 'substack' | 'mailerlite';

export type SiteMetaData = {
  title: {
    template: string;
    default: string;
  };
  description: string;
  siteRepo: string;
  newsletterProvider?: NewsletterProvider;
  newsletterUrl?: string;
  analyticsProvider?: AnalyticsProvider;
  defaultTheme: 'light' | 'dark' | 'system';
  activeAnnouncement: boolean;
  announcement: Pick<AnnouncementBarProps, 'buttonText' | 'link'>;
  postsPerPage: number;
  postsOnHomePage: number;
  projectsOnHomePage: number;
};

export type Series = {
  title: string;
  order: number;
}

export type SeriesItem = {
  title: string;
  slug: Post['slug'];
  status: Post['status'];
  isCurrent: boolean;
};

export type TocEntry = {
  title: string;
  url: string;
  heading: number;
  items: TocEntry[]
}

export type FlattenedTocEntry = {
  title: string;
  url: string;
  level: number;
};

export type PostSeries = Series & { posts: SeriesItem[] };

export type PostWithSeries = Omit<Post, "series"> & { series: PostSeries };

export type SocialProfile = {
  name: string;
  link: string;
};

export type AuthorType = {
  name: string;
  handle: string;
  socialProfiles: SocialProfile[];
  email: string;
  website: string;
  jobTitle: string;
  company: { name: string, website: string };
  availableForWork: boolean;
  location: {
    city: string;
    media: string;
  };
};
