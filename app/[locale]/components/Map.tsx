"use client";

import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Report } from '@prisma/client';
import L, { LatLngExpression } from 'leaflet';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { User } from 'next-auth';
import { useToast } from '@/hooks/use-toast';
import GeolocationButton from './GeolocationButton';
import ReportForm from './ReportForm';
import MapNotification from './MapNotification';
import WelcomeControl from './WelcomeControl';
import { Button } from '@/components/ui/button';
import './MapNotification.css';

// Fix for default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper function to create icons, moved outside the component to prevent recreation on re-renders
const getIconBySeverity = (severity: string) => {
  const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
    severity === 'HIGH' ? 'red' : severity === 'MEDIUM' ? 'orange' : 'yellow'
  }.png`;

  return new L.Icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

// Extend the SessionUser type to include role
interface SessionUser extends User {
  role?: string;
}

const Map = () => {
  const { data: session } = useSession();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [reportLocation, setReportLocation] = useState<L.LatLng | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const reportMarkerRef = useRef<L.Marker | null>(null);
  const [notification, setNotification] = useState<{ title: string; description: string; type: 'success' | 'error' | 'info' } | null>(null);
  const t = useTranslations('Map');
  const tEnums = useTranslations('Enums');
  const tReportDialog = useTranslations('ReportDialog');
  const tAdmin = useTranslations('Admin');

  const user = session?.user as SessionUser; // Cast session user to include role

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch('/data/haux-boundary.geojson');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error('Failed to fetch GeoJSON data:', error);
      }
    };

    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    const fetchPendingReports = async () => {
      if (user?.role === 'ADMIN') {
        try {
          const response = await fetch('/api/admin/reports');
          const data = await response.json();
          setPendingReports(data);
        } catch (error) {
          console.error('Failed to fetch pending reports:', error);
        }
      }
    };

    fetchGeoJson();
    fetchReports();
    fetchPendingReports();
  }, [user]);

  useEffect(() => {
    if (reportMarkerRef.current) {
      reportMarkerRef.current.openPopup();
    }
  }, [reportLocation]);

  const handleMapClick = (latlng: L.LatLng) => {
    if (reportLocation) return; // Lock map clicks when a report is already open

    if (session) {
      setReportLocation(latlng);
    } else {
      setNotification({
        title: t('loginRequiredTitle'),
        description: t('loginToReport'),
        type: 'error',
      });
    }
  };

  const handleReportSubmitted = () => {
    setNotification({
      title: "Success",
      description: t('reportSubmitted'),
      type: 'success',
    });
    // Refetch reports to display the new one
    fetch('/api/reports').then(res => res.json()).then(setReports);
    setReportLocation(null); // Close the popup
  };

  const handleModerateReport = async (reportId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPendingReports(prev => prev.filter(report => report.id !== reportId));
        // Optionally, refetch all reports to update the main view if approved reports are shown differently
        if (status === 'APPROVED') {
          fetch('/api/reports').then(res => res.json()).then(setReports);
        }
        setNotification({
          title: t('moderationSuccessTitle'),
          description: t('moderationSuccessDescription', { status: tAdmin(status.toLowerCase()) }),
          type: 'success',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to moderate report');
      }
    } catch (error) {
      console.error('Moderation error:', error);
      setNotification({
        title: t('moderationErrorTitle'),
        description: (error as Error).message,
        type: 'error',
      });
    }
  };

  const center: LatLngExpression = [44.75, -0.38];

  const markers = useMemo(() => {
    if (!Array.isArray(reports)) {
      return null;
    }
    return reports.map((report) => (
      <Marker
        key={report.id}
        position={[report.latitude, report.longitude]}
        icon={getIconBySeverity(report.severity)}
      >
        <Popup>
          <b>{tReportDialog('issueTypeLabel')}:</b> {tEnums(report.issueType)} <br />
          <b>{tReportDialog('severityLabel')}:</b> {tEnums(report.severity)}
        </Popup>
      </Marker>
    ));
  }, [reports, tReportDialog, tEnums]);

  const adminMarkers = useMemo(() => {
    if (user?.role !== 'ADMIN') return null;

    return pendingReports.map((report) => (
      <Marker
        key={`pending-${report.id}`}
        position={[report.latitude, report.longitude]}
        icon={purpleIcon}
      >
        <Popup>
          <div>
            <p><b>{tReportDialog('issueTypeLabel')}:</b> {tEnums(report.issueType)}</p>
            <p><b>{tReportDialog('severityLabel')}:</b> {tEnums(report.severity)}</p>
            <p><b>{tReportDialog('descriptionLabel')}:</b> {report.description}</p>
            <div className="mt-2 space-x-2">
              <Button onClick={() => handleModerateReport(report.id, 'APPROVED')} size="sm">
                {tAdmin('approve')}
              </Button>
              <Button onClick={() => handleModerateReport(report.id, 'REJECTED')} size="sm" variant="destructive">
                {tAdmin('reject')}
              </Button>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  }, [pendingReports, user, tReportDialog, tEnums, tAdmin]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && <GeoJSON data={geoJsonData} style={() => ({ color: '#4a83ec', weight: 2 })} />}

      <MarkerClusterGroup>
        {markers}
        {adminMarkers}
      </MarkerClusterGroup>

      <MapClickHandler onMapClick={handleMapClick} />

      {/* Add GeolocationButton here, inside MapContainer */}
      <GeolocationButton />

      <MapNotification message={notification} onClose={() => setNotification(null)} />

      {reportLocation && (
        <Marker position={reportLocation} ref={reportMarkerRef}>
          <Popup closeOnClick={false} closeButton={false}>
            <ReportForm
              location={{ lat: reportLocation.lat, lng: reportLocation.lng }}
              onReportSubmitted={handleReportSubmitted}
              onCancel={() => setReportLocation(null)}
              onError={({ title, description }) => setNotification({ title, description, type: 'error' })}
            />
          </Popup>
        </Marker>
      )}

      <WelcomeControl />
    </MapContainer>
  );
};

export default Map;
