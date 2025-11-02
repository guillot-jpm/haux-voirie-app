import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"

const prisma = new PrismaClient();

export async function GET() {
  try {
    const approvedReports = await prisma.report.findMany({
      where: {
        status: 'APPROVED',
      },
    });
    return NextResponse.json(approvedReports, { status: 200 });
  } catch (error) {
    console.error("Error fetching approved reports:", error);
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

  const data = await request.json()
  const { latitude, longitude, issueType, severity } = data

  if (!latitude || !longitude || !issueType || !severity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const newReport = await prisma.report.create({
      data: {
        latitude,
        longitude,
        issueType,
        severity,
        status: 'PENDING',
        authorId: user.id,
      },
    })
    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Could not create report" }, { status: 500 })
  }
}
