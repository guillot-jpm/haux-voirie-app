'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LoginButton() {
  const t = useTranslations('LoginPage');
  const locale = useLocale();
  const { data: session, status } = useSession();
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || status === 'loading') {
    return <Button variant="ghost" disabled className="opacity-50">...</Button>;
  }

  if (status === 'authenticated') {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-muted-foreground font-medium">
             {t('signedInAs', { email: '' })}
          </span>
          <span className="text-sm font-semibold leading-none">
            {session.user?.email}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="flex flex-row items-center gap-2 h-10 px-4"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline-block whitespace-nowrap">{t('signOutButton')}</span>
        </Button>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/login`}>
      <Button className="flex flex-row items-center gap-2 shadow-sm h-10 px-4">
        <User className="h-4 w-4" />
        <span className="whitespace-nowrap">{t('signInButton')}</span>
      </Button>
    </Link>
  );
}
