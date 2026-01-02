import { AuthorType, SiteMetaData } from '@/types';

import { socialProfiles } from './social-data';

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`);

export const defaultAuthor: AuthorType = {
  name: 'author.name',
  handle: '@acheddir',
  socialProfiles,
  email: 'acheddir@outlook.fr',
  website: 'https://acheddir.com',
  jobTitle: 'Software Developer & Architect',
  company: { name: '@Redsen', website: 'https://www.redsen.com' },
  availableForWork: false,
  location: {
    city: 'sidebar.location.city',
    media: '/casablanca.jpg',
  },
};

const defaultTitle = 'metadata.title';
const defaultDescription = `I'm ${defaultAuthor.name}. Building hackin’ cool digital products around the world 🌴.`;

export const siteMetadata: SiteMetaData = {
  title: {
    template: `%s | ${defaultTitle}`,
    default: defaultTitle,
  },
  description: defaultDescription,
  siteRepo: 'https://github.com/acheddir',
  newsletterProvider: 'mailerlite',
  newsletterUrl: 'https://developreneur.davidlevai.com',
  technologyRadarUrl: 'https://radar.thoughtworks.com/?documentId=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1K6fCZk1atAtIOgsEOovpeI_9_nSCT43MY_ieAeiP9cM%2Fedit%3Fusp%3Dsharing',
  analyticsProvider: 'umami',
  defaultTheme: 'system',
  activeAnnouncement: false,
  announcement: {
    buttonText: 'Support on DevHunt →',
    link: 'https://devhunt.org/tool/modern-developer-blog-template-digital-garden-starter',
  },
  postsPerPage: 10,
  postsOnHomePage: 8,
  projectsOnHomePage: 4,
};
