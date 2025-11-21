import { arMA, enGB } from 'date-fns/locale';

export const fallbackLocale = 'en';
export const locales = [fallbackLocale, 'ma'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

export function toggleLocale(locale: string, pathname: string) {
  // If the pathname is the root, switch the locale
  if (pathname === `/${locale}`) {
    return `/${locale === 'ma' ? 'en' : 'ma'}`;
  }

  // Replace /ma/ with /en/ or vice versa in the path
  return pathname.replace(/^\/(ma|en)\//, (_, currentLocale) => `/${currentLocale === 'ma' ? 'en' : 'ma'}/`);
}

export function getCountryCodes(locale: string) {
  return {
    current: locale === 'ma' ? 'MA' : 'GB',
    alternate: locale === 'ma' ? 'GB' : 'MA',
  };
}

export function getDateLocale(locale: string) {
  return locale === 'ma' ? arMA : enGB;
}

export function getOptions(lng = fallbackLocale, ns: string | string[] = defaultNS) {
  return {
    // debug: true,
    supportedLngs: locales,
    // preload: locales,
    fallbackLocale,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  };
}
