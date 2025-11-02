import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['fr', 'en'],

  // Used when no locale matches
  defaultLocale: 'fr'
});

export const config = {
  matcher: [
    // Match all pathnames except for
    '/((?!_next|api|favicon.ico).*)',
  ]
};
