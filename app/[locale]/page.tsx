"use client";

import { useTranslations } from 'next-intl';
import LoginButton from "./components/LoginButton";
import MapLoader from "./components/MapLoader";

export default function Home() {
  const t = useTranslations('LoginPage');

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full p-4 flex justify-between items-center bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <LoginButton />
      </div>
      <div className="w-full h-[calc(100vh-80px)]">
        <MapLoader />
      </div>
    </main>
  );
}
