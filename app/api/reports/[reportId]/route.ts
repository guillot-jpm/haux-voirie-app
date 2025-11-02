import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { reportId: string } }
) {
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

  const { reportId } = params;
  const { status } = await request.json();

  if (status !== "APPROVED" && status !== "REJECTED") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error(`Error updating report ${reportId}:`, error);
    return NextResponse.json(
      { error: "Could not update report" },
      { status: 500 }
    );
  }
}
