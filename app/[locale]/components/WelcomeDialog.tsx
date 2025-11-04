"use client";

import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'welcomePopupSeen';

export default function WelcomeDialog() {
  const t = useTranslations('WelcomeDialog');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-4 mb-4">
            <Image src="/logo.svg" alt="Haux & Vous Logo" width={60} height={60} />
            <AlertDialogTitle className="text-2xl">{t('title')}</AlertDialogTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold mb-2">{t('greeting')}</p>
            <p className="mb-2">{t('p1')}</p>
            <p>{t('p2')}</p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>{t('closeButton')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
