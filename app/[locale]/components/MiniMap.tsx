"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import dynamic from "next/dynamic";

// leaflet-defaulticon-compatibility is not used in this project, so we have to manually set the icon image paths
// See: https://github.com/PaulLeCam/react-leaflet/issues/808
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = icon;

interface MiniMapProps {
  latitude: number;
  longitude: number;
}

const MiniMap: React.FC<MiniMapProps> = ({ latitude, longitude }) => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className="h-40 w-full">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MiniMap), {
  ssr: false,
});
