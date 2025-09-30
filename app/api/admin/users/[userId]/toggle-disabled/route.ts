import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if requesting user is admin
    const admin = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await params;

    // Get the user to toggle
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from disabling themselves
    if (user.clerkId === clerkId) {
      return NextResponse.json(
        { error: "Cannot disable yourself" },
        { status: 400 }
      );
    }

    // Toggle disabled status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { disabled: !user.disabled },
    });

    return NextResponse.json({
      success: true,
      disabled: updatedUser.disabled,
    });
  } catch (error) {
    console.error("Error toggling user disabled status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}