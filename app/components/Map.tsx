"use client";

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';

const Map = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Fetch the GeoJSON data from the public folder
    fetch('/data/haux-boundary.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      });
  }, []);

  const center: LatLngExpression = [44.75, -0.38]; // Center on Haux

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={() => ({
            color: '#4a83ec',
            weight: 2,
            fillColor: "#1a1d62",
            fillOpacity: 0.2,
          })}
        />
      )}
    </MapContainer>
  );
};

export default Map;
