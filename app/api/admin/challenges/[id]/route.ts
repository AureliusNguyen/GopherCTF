import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await req.json();

    const { title, description, flag, basePoints, minPoints, difficulty, categoryId, files } = body;

    // Validate required fields
    if (!title || !description || !flag || !basePoints || !difficulty || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the challenge
    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: {
        title,
        description,
        flag,
        basePoints: parseInt(basePoints),
        minPoints: minPoints ? parseInt(minPoints) : 50,
        difficulty,
        categoryId,
        files: files || null,
      },
    });

    return NextResponse.json({ success: true, challenge: updatedChallenge });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}