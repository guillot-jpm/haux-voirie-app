"use client";

import { useTranslations } from 'next-intl';
import { useSession, signOut } from "next-auth/react";
import LoginDialog from "./LoginDialog";

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
    <div className="flex items-center gap-4">
      <p className="text-sm text-muted-foreground">{t('notSignedIn')}</p>
      <LoginDialog />
    </div>
  );
}
