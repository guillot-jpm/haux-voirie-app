"use client";

import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Circle, CircleMarker } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Crosshair, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import L from 'leaflet';

const GeolocationButton = () => {
  const t = useTranslations('Map');
  const { toast } = useToast();
  const map = useMap();
  const [isLoading, setIsLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);

  const locateUser = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const latLng: [number, number] = [latitude, longitude];

        // Store position and accuracy for rendering circles
        setUserPosition({
          lat: latitude,
          lng: longitude,
          accuracy: accuracy, // accuracy in meters
        });

        // Animate the map to the new location
        map.flyTo(latLng, 15);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        // Only show toast if manually triggered (not on initial load)
        if (error.code !== error.PERMISSION_DENIED) {
          toast({
            title: t('geolocationErrorTitle'),
            description: t('geolocationErrorDescription'),
            variant: 'destructive',
          });
        }
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Automatically locate user on component mount
  useEffect(() => {
    locateUser();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <Button
        size="lg"
        onClick={locateUser}
        className="absolute top-4 right-4 z-[1001] bg-white text-black hover:bg-gray-100 h-12 w-12"
        aria-label="Find my location"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Crosshair className="h-6 w-6" />}
      </Button>

      {/* Render user position if available */}
      {userPosition && (
        <>
          {/* Accuracy circle (uncertainty radius) */}
          <Circle
            center={[userPosition.lat, userPosition.lng]}
            radius={userPosition.accuracy}
            pathOptions={{
              color: '#4285F4',
              fillColor: '#4285F4',
              fillOpacity: 0.1,
              weight: 1,
            }}
          />

          {/* User position marker (blue dot) */}
          <CircleMarker
            center={[userPosition.lat, userPosition.lng]}
            radius={8}
            pathOptions={{
              color: '#FFFFFF',
              fillColor: '#4285F4',
              fillOpacity: 1,
              weight: 2,
            }}
          />
        </>
      )}
    </>
  );
};

export default GeolocationButton;
