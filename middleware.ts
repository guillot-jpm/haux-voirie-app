import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always' // Add this line
});

export const config = {
  matcher: ['/', '/(fr|en)/:path*']
};
