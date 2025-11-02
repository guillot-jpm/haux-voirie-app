import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ userId: string }> }
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

  const { userId } = await paramsPromise;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: "BANNED" },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to ban user:", error);
    return NextResponse.json(
      { error: "Failed to ban user" },
      { status: 500 }
    );
  }
}
