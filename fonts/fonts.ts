import { Inter, Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '600', '700'],
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-paragraph',
});

export const fustat = localFont({
  src: [
    {
      path: './fustat-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fustat-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fustat-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fustat-800.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-heading',
  display: 'swap',
});

export const bouazziMaghribi = localFont({
  src: './bouazzi-maghribi.woff2',
  variable: '--font-special',
  display: 'swap',
});

export const ibmPlexSansArabic = localFont({
  src: [
    {
      path: './ibm-plex-sans-arabic-100.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './ibm-plex-sans-arabic-200.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './ibm-plex-sans-arabic-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './ibm-plex-sans-arabic-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './ibm-plex-sans-arabic-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './ibm-plex-sans-arabic-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './ibm-plex-sans-arabic-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-paragraph',
  display: 'swap',
});
