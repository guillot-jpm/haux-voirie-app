import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Exclude /api, /data, /_next, and static files
  matcher: ['/', '/(fr|en)/:path*', '/((?!api|data|_next|_vercel|.*\\..*).*)']
};
