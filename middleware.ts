import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['fr', 'en'],

  // Used when no locale matches
  defaultLocale: 'fr',

  // Disable automatic locale detection to enforce the default locale
  localeDetection: false
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en)/:path*']
};
