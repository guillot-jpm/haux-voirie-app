import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const pendingReports = await prisma.report.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });
    return NextResponse.json(pendingReports, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    return NextResponse.json(
      { error: "Could not fetch reports" },
      { status: 500 }
    );
  }
}
