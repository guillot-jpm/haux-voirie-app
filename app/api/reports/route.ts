import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

// This is a placeholder for the actual authOptions you have in your [...nextauth] route
// We will need to create a dedicated authOptions file in a later step for reusability.
import { handler as authHandler } from "@/app/api/auth/[...nextauth]/route"


const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authHandler)

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
