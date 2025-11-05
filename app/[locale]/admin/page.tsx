import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import dynamic from "next/dynamic";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

const AdminDashboard = dynamic(
  () => import("../components/AdminDashboard"),
  { ssr: false }
);

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("AdminDashboard");

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <h1>{t('pageTitle')}</h1>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
