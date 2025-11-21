import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

import { cookieName, fallbackLocale, locales } from './app/i18n/settings';

acceptLanguage.languages(locales);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)'],
};

export function middleware(req: NextRequest) {
  let locale;

  if (req.cookies.has(cookieName)) locale = acceptLanguage.get(req.cookies.get(cookieName)?.value);

  if (!locale) locale = acceptLanguage.get(req.headers.get('Accept-Language'));

  if (!locale) locale = fallbackLocale;

  // Redirect if locale in path is not supported
  if (
    !locales.some((locale) => req.nextUrl.pathname.startsWith(`/${locale}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${locale}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!);
    const localeInReferer = locales.find((locale) => refererUrl.pathname.startsWith(`/${locale}`));
    const response = NextResponse.next();
    if (localeInReferer) response.cookies.set(cookieName, localeInReferer);
    return response;
  }

  return NextResponse.next();
}
