import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import { Resend } from "resend"
import { NewReportEmail } from "@/emails/NewReportEmail"

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    const whereClause: any = {
      status: 'APPROVED',
    };

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        whereClause.OR = [
          { status: 'APPROVED' },
          { authorId: user.id, status: 'PENDING' }
        ];
        delete whereClause.status; // Remove the top-level status filter as it's now in the OR
      }
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
    });
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Could not fetch reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (user.status === 'BANNED') {
    return NextResponse.json({ error: "Your account has been banned." }, { status: 403 });
  }

  // Enforce reporting limits for VISITOR role
  if (user.role === 'VISITOR') {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const reportCount = await prisma.report.count({
      where: {
        authorId: user.id,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    if (reportCount >= 10) {
      return NextResponse.json({ error: "You have reached the reporting limit for today." }, { status: 429 });
    }
  }

  const data = await request.json()
  const { latitude, longitude, issueType, severity, description, photoUrl } = data

  if (!latitude || !longitude || !issueType || !severity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const reportData: any = {
      latitude,
      longitude,
      issueType,
      severity,
      status: 'PENDING',
      authorId: user.id,
    };

    if (user.role !== 'VISITOR') {
      reportData.description = description;
      reportData.photoUrl = photoUrl;
    }

    const newReport = await prisma.report.create({
      data: reportData,
    });

    // --- Start Admin Notification Logic ---
    try {
      const appState = await prisma.appState.findUnique({
        where: { singletonKey: "primary" },
      });

      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      if (!appState?.lastNotificationSentAt || appState.lastNotificationSentAt < twelveHoursAgo) {
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
        });

        const adminEmails = admins.map(admin => admin.email).filter((email): email is string => email !== null);

        if (adminEmails.length > 0) {
          const origin = request.headers.get('origin') || 'http://localhost:3000';
          const adminDashboardUrl = `${origin}/en/admin`;

          await resend.emails.send({
            from: 'Haux Voirie <noreply@haux-voirie.com>', // Replace with your verified domain
            to: adminEmails,
            subject: 'New Road Report Submitted - Haux Voirie',
            react: NewReportEmail({ adminDashboardUrl }),
          });

          await prisma.appState.update({
            where: { singletonKey: "primary" },
            data: { lastNotificationSentAt: now },
          });
        }
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Do not block the response for the user if email fails
    }
    // --- End Admin Notification Logic ---

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Could not create report" }, { status: 500 })
  }
}
