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
import { useToast } from '@/hooks/use-toast';
import GeolocationButton from './GeolocationButton';
import ReportForm from './ReportForm';
import MapNotification from './MapNotification';
import WelcomeControl from './WelcomeControl';
import AdminPopup from './AdminPopup';
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

const getPendingIcon = () => {
  return new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
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
  const [reports, setReports] = useState<Report[]>([]);
  const [adminPendingReports, setAdminPendingReports] = useState<Report[]>([]);
  const [userPendingReports, setUserPendingReports] = useState<Report[]>([]);
  const reportMarkerRef = useRef<L.Marker | null>(null);
  const [notification, setNotification] = useState<{ title: string; description: string; type: 'success' | 'error' | 'info' } | null>(null);
  const t = useTranslations('Map');
  const tEnums = useTranslations('Enums');
  const tReportDialog = useTranslations('ReportDialog');

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
        const allReports: Report[] = await response.json();

        const approved = allReports.filter(r => r.status === 'APPROVED');
        const userPending = allReports.filter(r => r.status === 'PENDING');

        setReports(approved);
        setUserPendingReports(userPending);

      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    const fetchAdminPendingReports = async () => {
      if (session?.user?.role === 'ADMIN') {
        try {
          const response = await fetch('/api/admin/reports');
          const data = await response.json();
          setAdminPendingReports(data);
        } catch (error) {
          console.error('Failed to fetch admin pending reports:', error);
        }
      }
    };

    fetchGeoJson();
    fetchReports();
    fetchAdminPendingReports();
  }, [session]);

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

  const handleReportSubmitted = (newReport: Report) => {
    setNotification({
      title: "Success",
      description: t('reportSubmitted'),
      type: 'success',
    });
    if (session?.user?.role === 'ADMIN') {
      setAdminPendingReports(current => [...current, newReport]);
    } else {
      setUserPendingReports(current => [...current, newReport]);
    }
    setReportLocation(null); // Close the popup
  };

  const handleModerationComplete = (reportId: string, approvedReport?: Report) => {
    setAdminPendingReports(current => current.filter(r => r.id !== reportId));
    if (approvedReport) {
      setReports(current => [...current, approvedReport]);
    }
  };

  const center: LatLngExpression = [44.75, -0.38];

  const markers = useMemo(() => {
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

  const pendingMarkers = useMemo(() => {
    const isAdmin = session?.user?.role === 'ADMIN';
    const reportsToRender = isAdmin ? adminPendingReports : userPendingReports;

    return reportsToRender.map((report) => (
      <Marker
        key={report.id}
        position={[report.latitude, report.longitude]}
        icon={getPendingIcon()}
      >
        <Popup>
          {isAdmin ? (
            <AdminPopup report={report} onActionComplete={handleModerationComplete} />
          ) : (
            <>
              <b>{tReportDialog('issueTypeLabel')}:</b> {tEnums(report.issueType)} <br />
              <b>{tReportDialog('severityLabel')}:</b> {tEnums(report.severity)} <br />
              <b>Status:</b> PENDING
            </>
          )}
        </Popup>
      </Marker>
    ));
  }, [adminPendingReports, userPendingReports, session, tReportDialog, tEnums]);

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
        {pendingMarkers}
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
