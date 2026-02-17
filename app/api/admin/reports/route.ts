import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { ReportStatus } from "@prisma/client";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status') ?? 'PENDING';

  if (!['PENDING', 'APPROVED'].includes(statusParam)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const reports = await prisma.report.findMany({
      where: {
        status: statusParam as ReportStatus,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    return NextResponse.json(
      { error: "Could not fetch reports" },
      { status: 500 }
    );
  }
}
