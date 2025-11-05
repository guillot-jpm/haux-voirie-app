'use client';

import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('./AdminDashboard'),
  {
    ssr: false,
    loading: () => <p>Loading dashboard...</p> // Optional: add a loading state
  }
);

const AdminPageClient = () => {
  return <AdminDashboard />;
};

export default AdminPageClient;
