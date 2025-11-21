'use client';

import { useEffect, useState } from 'react';
import i18next, { dir, FlatNamespace, KeyPrefix } from 'i18next';
// import LocizeBackend from 'i18next-locize-backend'
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useCookies } from 'react-cookie';
import {
  FallbackNs,
  initReactI18next,
  UseTranslationOptions,
  useTranslation as useTranslationOrg,
  UseTranslationResponse,
} from 'react-i18next';

import { cookieName, getOptions, locales } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  // .use(LocizeBackend) // locize backend could be used on client side, but prefer to keep it in sync with server side
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : [],
  });

export function useTranslation<Ns extends FlatNamespace, KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined>(
  locale: string,
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const [cookies, setCookie] = useCookies([cookieName]);
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  if (runsOnServerSide && locale && i18n.resolvedLanguage !== locale) {
    i18n.changeLanguage(locale);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return;
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!locale || i18n.resolvedLanguage === locale) return;
      i18n.changeLanguage(locale);
    }, [locale, i18n]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies.i18next === locale) return;
      setCookie(cookieName, locale, { path: '/' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale, cookies.i18next]);
  }
  return ret;
}
