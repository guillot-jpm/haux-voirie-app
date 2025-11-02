import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { reportId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (currentUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reportId } = params;
  const { status } = await request.json();

  if (!status || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error("Failed to update report status:", error);
    return NextResponse.json(
      { error: "Failed to update report status" },
      { status: 500 }
    );
  }
}
