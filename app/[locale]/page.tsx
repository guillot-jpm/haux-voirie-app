"use client";

import { useTranslations } from 'next-intl';
import LoginButton from "@/app/[locale]/components/LoginButton"; // Adjust path if needed
import GeolocationButton from "@/app/[locale]/components/GeolocationButton"; // Import the new component
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Image from 'next/image';

export default function Home() {
  const t = useTranslations('LoginPage');

  const Map = useMemo(() => dynamic(
    () => import('@/app/[locale]/components/Map'), // Adjust path if needed
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full p-4 flex justify-between items-center bg-gray-100 shadow-md">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Haux & Vous Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <LoginButton />
      </div>
      {/* Add relative positioning to this container */}
      <div className="relative w-full h-[calc(100vh-80px)]">
        <Map />
        {/* The GeolocationButton renders here, on top of the map */}
      </div>
    </main>
  );
}
