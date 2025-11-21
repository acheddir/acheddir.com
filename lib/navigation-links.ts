import { ContentNavItem, NavItem } from '@/types';

import { defaultAuthor } from '@/lib/metadata';

const content: ContentNavItem[] = [
  {
    title: 'navbar.blog',
    href: '/posts',
  },
  {
    title: 'navbar.categories',
    href: '/categories',
  },
  {
    title: 'navbar.tags',
    href: '/tags',
  },
  {
    title: 'navbar.archives',
    href: '/archives',
  },
  // {
  //   title: 'navbar.videos',
  //   href: defaultAuthor.socialProfiles.find((platform) => platform.name === 'youtube')?.link as string,
  // },
];

export const navigationLinks: NavItem[] = [
  {
    title: 'navbar.content',
    content,
  },
  // {
  //   title: 'navbar.projects',
  //   href: '/projects',
  // },
  {
    title: 'navbar.uses',
    href: '/uses',
  },
  {
    title: 'navbar.now',
    href: '/now',
  },
];
