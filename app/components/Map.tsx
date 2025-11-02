"use client";

import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import { useSession } from 'next-auth/react';
import ReportDialog from './ReportDialog';

// Fix for default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map click events
const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Map = () => {
  const { data: session } = useSession();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [reportLocation, setReportLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch('/data/haux-boundary.geojson')
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data));
  }, []);

  const handleMapClick = (latlng: L.LatLng) => {
    if (session) { // Only allow clicks if logged in
      setReportLocation(latlng);
    } else {
      alert("Please log in to report an issue.");
    }
  };

  const closeDialog = () => {
    setReportLocation(null);
  };
  
  const handleReportSubmitted = () => {
    alert("Thank you! Your report has been submitted for review.");
    closeDialog();
  };

  const center: LatLngExpression = [44.75, -0.38];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && <GeoJSON data={geoJsonData} style={() => ({ color: '#4a83ec', weight: 2 })} />}
        
        <MapClickHandler onMapClick={handleMapClick} />

        {reportLocation && <Marker position={reportLocation} />}
      </MapContainer>

      {reportLocation && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1000 }}>
          <div style={{ pointerEvents: 'auto' }}>
            <ReportDialog 
              location={reportLocation} 
              onClose={closeDialog} 
              onReportSubmitted={handleReportSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
