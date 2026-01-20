import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { IssueType, Severity, ReportStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reportId: string } }
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

  const { reportId } = params;
  const { status, description, photoUrl, issueType, severity, rejectionReason } =
    await request.json();

  const updateData: {
    status?: ReportStatus;
    description?: string;
    photoUrl?: string;
    issueType?: IssueType;
    severity?: Severity;
    rejectionReason?: string;
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

  if (rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
      include: { author: true },
    });

    const { author } = updatedReport;

    // Notification logic
    if (
      (status === "APPROVED" || status === "REJECTED") &&
      author.notifyOnStatusChange
    ) {
      if (status === "APPROVED") {
        // TODO: Send approval email
        console.log(`Sending approval notification to ${author.email}`);
      } else if (status === "REJECTED") {
        // TODO: Send rejection email with reason
        console.log(
          `Sending rejection notification to ${author.email} with reason: ${rejectionReason}`
        );
      }
    }

    // Promotion Logic
    if (status === "APPROVED") {
      const approvedReportsCount = await prisma.report.count({
        where: {
          authorId: author.id,
          status: "APPROVED",
        },
      });

      if (author.role === "NEWCOMER" && approvedReportsCount >= 1) {
        await prisma.user.update({
          where: { id: author.id },
          data: { role: "VISITOR" },
        });
      } else if (author.role === "VISITOR" && approvedReportsCount >= 100) {
        await prisma.user.update({
          where: { id: author.id },
          data: { role: "CITIZEN" },
        });
      }

      // Reset the notification timer if a report is approved
      await prisma.appState.upsert({
        where: { singletonKey: "primary" },
        update: { lastNotificationSentAt: null },
        create: {
          singletonKey: "primary",
          lastNotificationSentAt: null,
        },
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
