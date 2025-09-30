import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
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

    const { teamId } = await params;

    // Get the team to toggle
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Toggle disabled status
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { disabled: !team.disabled },
    });

    return NextResponse.json({
      success: true,
      disabled: updatedTeam.disabled,
    });
  } catch (error) {
    console.error("Error toggling team disabled status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}