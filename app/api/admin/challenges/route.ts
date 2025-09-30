import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
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

    const body = await req.json();
    console.log("Received body:", JSON.stringify(body, null, 2));
    const { title, description, flag, basePoints, minPoints, difficulty, categoryId, files } = body;
    console.log("Types:", { basePoints: typeof basePoints, minPoints: typeof minPoints });

    // Validate required fields
    if (!title || !description || !flag || !basePoints || !difficulty || !categoryId) {
      console.log("Missing fields:", { title: !!title, description: !!description, flag: !!flag, basePoints: !!basePoints, difficulty: !!difficulty, categoryId: !!categoryId });
      return NextResponse.json(
        { error: "Missing required fields", received: { title: !!title, description: !!description, flag: !!flag, basePoints: !!basePoints, difficulty: !!difficulty, categoryId: !!categoryId } },
        { status: 400 }
      );
    }

    // Check if challenge with this title already exists
    const existing = await prisma.challenge.findUnique({
      where: { title },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Challenge with this title already exists" },
        { status: 400 }
      );
    }

    // Create the challenge
    const parsedBasePoints = parseInt(basePoints);
    const parsedMinPoints = minPoints && minPoints !== "" ? parseInt(minPoints) : 50;

    // Validate parsed numbers
    if (isNaN(parsedBasePoints) || isNaN(parsedMinPoints)) {
      return NextResponse.json(
        { error: "Base points and min points must be valid numbers" },
        { status: 400 }
      );
    }

    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        description,
        flag,
        basePoints: parsedBasePoints,
        minPoints: parsedMinPoints,
        difficulty,
        categoryId,
        files: files || null,
        visible: true,
      },
    });

    return NextResponse.json({ success: true, challenge: newChallenge });
  } catch (error) {
    console.error("Error creating challenge:", error);
    console.error("Error name:", error instanceof Error ? error.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && 'code' in error) {
      console.error("Error code:", (error as any).code);
    }
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}