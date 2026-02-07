'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const t = useTranslations('LoginPage');
  const locale = useLocale();

  return (
    <Link href={`/${locale}/login`}>
      <Button variant="outline" size="sm">
        {t('signInButton')}
      </Button>
    </Link>
  );
}
