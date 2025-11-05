import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { IssueType, Severity, ReportStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ reportId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (currentUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { reportId } = await paramsPromise;
  const { status, description, photoUrl, issueType, severity } = await request.json();

  const updateData: {
    status?: ReportStatus;
    description?: string;
    photoUrl?: string;
    issueType?: IssueType;
    severity?: Severity;
  } = {};

  if (status) {
    if (!["PENDING", "APPROVED", "REJECTED", "RESOLVED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updateData.status = status as ReportStatus;
  }

  if (description) {
    updateData.description = description;
  }

  if (photoUrl) {
    updateData.photoUrl = photoUrl;
  }

  if (issueType) {
    updateData.issueType = issueType as IssueType;
  }

  if (severity) {
    updateData.severity = severity as Severity;
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
      include: { author: true },
    });

    // If the report was approved and the author is a VISITOR, check for promotion
    if (status === "APPROVED" && updatedReport.author.role === "VISITOR") {
      const approvedReportsCount = await prisma.report.count({
        where: {
          authorId: updatedReport.authorId,
          status: "APPROVED",
        },
      });

      if (approvedReportsCount >= 100) {
        await prisma.user.update({
          where: { id: updatedReport.authorId },
          data: { role: "CITIZEN" },
        });
      }

      // Reset the notification timer if the report is approved
      await prisma.appState.update({
        where: { singletonKey: "primary" },
        data: { lastNotificationSentAt: null },
      });
    }

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error("Failed to update report status:", error);
    return NextResponse.json(
      { error: "Failed to update report status" },
      { status: 500 }
    );
  }
}
