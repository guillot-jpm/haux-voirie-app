"use client";

import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Crosshair, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const GeolocationButton = () => {
  const t = useTranslations('Map');
  const { toast } = useToast();
  const map = useMap();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latLng: [number, number] = [latitude, longitude];

        // Animate the map to the new location
        map.flyTo(latLng, 15); // Zoom level 15 is good for a neighborhood view
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: t('geolocationErrorTitle'),
          description: t('geolocationErrorDescription'),
          variant: 'destructive',
        });
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Button
      size="icon"
      onClick={handleClick}
      className="absolute top-4 right-4 z-[1001] bg-white text-black hover:bg-gray-100"
      aria-label="Find my location"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
    </Button>
  );
};

export default GeolocationButton;
