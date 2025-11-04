"use client";

import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("./AdminDashboard"),
  { ssr: false }
);

const AdminPageClient = () => {
  return <AdminDashboard />;
};

export default AdminPageClient;
