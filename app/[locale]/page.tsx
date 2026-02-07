"use client";

import { useTranslations } from 'next-intl';
import LoginButton from "@/app/[locale]/components/LoginButton"; 
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Image from 'next/image';

export default function Home() {
  const t = useTranslations('LoginPage');

  const Map = useMemo(() => dynamic(
    () => import('@/app/[locale]/components/Map'), 
    {
      loading: () => <div className="h-full w-full bg-muted/20 animate-pulse" />,
      ssr: false
    }
  ), []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Updated Header Styling */}
      <div className="w-full h-20 px-6 flex justify-between items-center bg-white border-b z-10">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="HAUX C'EST VOUS Logo" width={48} height={48} className="rounded-sm" />
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">{t('title')}</h1>
        </div>
        <LoginButton />
      </div>
      
      <div className="relative w-full h-[calc(100vh-80px)]">
        <Map />
      </div>
    </main>
  );
}
