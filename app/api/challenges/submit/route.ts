import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { calculateDynamicScore } from "@/lib/scoring";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { challengeId, flag } = await req.json();

    if (!challengeId || !flag) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create user in our database
    const clerkUser = await currentUser();
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { team: true }
    });

    if (!user && clerkUser) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          username: clerkUser.username || clerkUser.firstName || "User",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        },
        include: { team: true }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        _count: {
          select: { solves: true }
        }
      }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Check if already solved
    const existingSolve = await prisma.solve.findFirst({
      where: {
        challengeId,
        OR: [
          { userId: user.id },
          ...(user.teamId ? [{ teamId: user.teamId }] : [])
        ]
      }
    });

    if (existingSolve) {
      return NextResponse.json(
        { error: "Challenge already solved", correct: false },
        { status: 400 }
      );
    }

    // Validate flag (case-insensitive, trimmed)
    const isCorrect = flag.trim().toLowerCase() === challenge.flag.toLowerCase();

    // If user is admin, just validate flag without recording
    if (user.isAdmin) {
      return NextResponse.json({
        correct: isCorrect,
        points: 0,
        message: isCorrect
          ? "Correct flag! (Admin test - no points awarded)"
          : "Incorrect flag",
        isAdmin: true
      });
    }

    // Create submission record for non-admin users
    await prisma.submission.create({
      data: {
        userId: user.id,
        teamId: user.teamId,
        challengeId,
        submitted: flag.trim(),
        correct: isCorrect,
      }
    });

    if (!isCorrect) {
      return NextResponse.json({ correct: false });
    }

    // Calculate points for this solve
    const points = calculateDynamicScore(
      challenge.basePoints,
      challenge.minPoints,
      challenge._count.solves
    );

    // Create solve record
    await prisma.solve.create({
      data: {
        userId: user.id,
        teamId: user.teamId,
        challengeId,
        points,
      }
    });

    // Update team score if user is in a team
    if (user.teamId) {
      await prisma.team.update({
        where: { id: user.teamId },
        data: {
          score: {
            increment: points
          }
        }
      });
    }

    return NextResponse.json({
      correct: true,
      points,
      message: "Congratulations! Challenge solved!"
    });

  } catch (error) {
    console.error("Flag submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}