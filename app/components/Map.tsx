"use client";

import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import { useSession } from 'next-auth/react';
import { ISSUE_TYPES, SEVERITY_LEVELS, LABELS } from '@/app/lib/constants';

// Fix for default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle the popup form
const ReportPopup = ({ 
  position, 
  onClose, 
  onSubmit 
}: { 
  position: L.LatLng; 
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [issueType, setIssueType] = useState('');
  const [severity, setSeverity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const map = useMap();

  useEffect(() => {
    // Center map on popup
    map.setView(position, map.getZoom());
  }, [position, map]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !severity) {
      alert('Please select both issue type and severity');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType,
          severity,
          latitude: position.lat,
          longitude: position.lng,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }
      
      alert('Thank you! Your report has been submitted for review.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popup 
      position={position} 
      eventHandlers={{
        remove: onClose
      }}
    >
      <div style={{ minWidth: '250px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
          Report New Issue
        </h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          Location: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Type of Issue
            </label>
            <select 
              value={issueType} 
              onChange={(e) => setIssueType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            >
              <option value="">Select an issue type</option>
              {ISSUE_TYPES.map(type => (
                <option key={type} value={type}>{LABELS[type]}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Severity
            </label>
            <select 
              value={severity} 
              onChange={(e) => setSeverity(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            >
              <option value="">Select severity level</option>
              {SEVERITY_LEVELS.map(level => (
                <option key={level} value={level}>{LABELS[level]}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: isSubmitting ? '#ccc' : '#000',
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </Popup>
  );
};

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
  const [reportLocation, setReportLocation] = useState<L.LatLng | null>(null);

  useEffect(() => {
    fetch('/data/haux-boundary.geojson')
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data));
  }, []);

  const handleMapClick = (latlng: L.LatLng) => {
    if (session) {
      setReportLocation(latlng);
    } else {
      alert("Please log in to report an issue.");
    }
  };

  const closePopup = () => {
    setReportLocation(null);
  };

  const handleReportSubmitted = (data: any) => {
    // Handle successful submission
    closePopup();
  };

  const center: LatLngExpression = [44.75, -0.38];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && <GeoJSON data={geoJsonData} style={() => ({ color: '#4a83ec', weight: 2 })} />}
      
      <MapClickHandler onMapClick={handleMapClick} />

      {reportLocation && (
        <ReportPopup 
          position={reportLocation}
          onClose={closePopup}
          onSubmit={handleReportSubmitted}
        />
      )}
    </MapContainer>
  );
};

export default Map;
