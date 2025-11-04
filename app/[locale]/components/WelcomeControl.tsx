"use client";

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import './WelcomeControl.css';

const STORAGE_KEY = 'welcomePopupSeen';

const WelcomeControl = () => {
  const map = useMap();
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

  useEffect(() => {
    if (!isOpen) return;

    const CustomControl = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-welcome-control-container');

        const header = L.DomUtil.create('div', 'leaflet-welcome-control-header', container);

        const logoContainer = L.DomUtil.create('div', '', header);
        const logo = document.createElement('img');
        logo.src = '/logo.svg';
        logo.alt = 'Haux & Vous Logo';
        logo.width = 60;
        logo.height = 60;
        logoContainer.appendChild(logo);

        const title = L.DomUtil.create('h2', 'leaflet-welcome-control-title', header);
        title.innerText = t('title');

        const body = L.DomUtil.create('div', 'leaflet-welcome-control-body', container);
        const greeting = L.DomUtil.create('p', 'font-semibold mb-2', body);
        greeting.innerText = t('greeting');
        const p1 = L.DomUtil.create('p', 'mb-2', body);
        p1.innerText = t('p1');
        const p2 = L.DomUtil.create('p', '', body);
        p2.innerText = t('p2');

        const footer = L.DomUtil.create('div', 'leaflet-welcome-control-footer', container);
        const closeButton = L.DomUtil.create('button', 'leaflet-welcome-control-close-button', footer);
        closeButton.innerText = t('closeButton');
        closeButton.onclick = handleClose;

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
      },
    });

    const control = new CustomControl({ position: 'topcenter' });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [isOpen, map, t]);

  return null;
};

export default WelcomeControl;
