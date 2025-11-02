import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import AdminDashboard from "@/app/components/AdminDashboard";
import prisma from "@/lib/prisma";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

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
      <h1>Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
