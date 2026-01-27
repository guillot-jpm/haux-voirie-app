import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const locale = searchParams.get("locale") || "en";

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { notifyOnStatusChange: false },
    });

    const unsubscribeSuccessUrl = new URL(`/${locale}/unsubscribe`, request.url);
    return NextResponse.redirect(unsubscribeSuccessUrl);
  } catch (error) {
    console.error("Failed to unsubscribe user:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe user" },
      { status: 500 }
    );
  }
}
