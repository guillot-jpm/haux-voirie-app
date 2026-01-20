"use client";

import { useTranslations } from 'next-intl';
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const t = useTranslations('LoginPage');
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p>{t('signedInAs', {email: session.user?.email || ''})}</p>
        <button onClick={() => signOut()}>{t('signOutButton')}</button>
      </div>
    );
  }

  return (
    <div>
      <p>{t('notSignedIn')}</p>
      <button onClick={() => signIn()}>{t('signInButton')}</button>
    </div>
  );
}
