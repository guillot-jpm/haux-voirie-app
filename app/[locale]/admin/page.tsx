import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import AdminDashboard from "../components/AdminDashboard";
import prisma from "@/lib/prisma";
import { useTranslations } from "next-intl";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  const t = useTranslations("AdminDashboard");

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
