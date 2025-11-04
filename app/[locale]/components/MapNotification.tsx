"use client";

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapNotification.css';

interface MapNotificationProps {
  message: {
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  } | null;
  onClose: () => void;
}

const MapNotification = ({ message, onClose }: MapNotificationProps) => {
  const map = useMap();

  useEffect(() => {
    if (!message) {
      return;
    }

    const customControl = new (L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create('div', `leaflet-notification-container ${message.type}`);

        const titleElement = L.DomUtil.create('h3', 'leaflet-notification-title', container);
        titleElement.innerText = message.title;

        const descriptionElement = L.DomUtil.create('p', 'leaflet-notification-description', container);
        descriptionElement.innerText = message.description;

        const closeButton = L.DomUtil.create('button', 'leaflet-notification-close', container);
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => {
          onClose();
        };

        // Disable map interactions when interacting with the notification
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
      },

      onRemove: function () {
        // Cleanup
      },
    }))({ position: 'topright' });

    map.addControl(customControl);

    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
      map.removeControl(customControl);
    };
  }, [map, message, onClose]);

  return null;
};

export default MapNotification;
