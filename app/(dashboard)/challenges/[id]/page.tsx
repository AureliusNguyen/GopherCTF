import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlagSubmissionForm } from "@/components/challenges/flag-submission-form";
import { calculateDynamicScore } from "@/lib/scoring";
import { ArrowLeft, Users, Trophy, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getChallenge(id: string, userId: string | null) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      category: true,
      solves: {
        orderBy: { solvedAt: 'asc' },
        take: 5,
        include: {
          user: {
            select: { username: true }
          },
          team: {
            select: { name: true }
          }
        }
      },
      _count: {
        select: { solves: true }
      }
    }
  });

  if (!challenge) return null;

  // Check if user has solved this challenge
  let userSolved = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        solves: {
          where: { challengeId: id }
        }
      }
    });
    userSolved = (user?.solves.length || 0) > 0;
  }

  return { challenge, userSolved };
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  const data = await getChallenge(id, userId);

  if (!data) {
    notFound();
  }

  const { challenge, userSolved } = data;

  const currentPoints = calculateDynamicScore(
    challenge.basePoints,
    challenge.minPoints,
    challenge._count.solves
  );

  const difficultyColors = {
    easy: "bg-green-500/10 text-green-500 border-green-500/50",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
    hard: "bg-red-500/10 text-red-500 border-red-500/50",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/challenges">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              style={{
                backgroundColor: `${challenge.category.color}20`,
                color: challenge.category.color,
                borderColor: challenge.category.color,
              }}
              className="border"
            >
              {challenge.category.name}
            </Badge>
            <Badge
              variant="outline"
              className={difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}
            >
              {challenge.difficulty}
            </Badge>
          </div>

          <CardTitle className="text-3xl">{challenge.title}</CardTitle>

          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="font-bold text-primary">{currentPoints}</span> points
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {challenge._count.solves} {challenge._count.solves === 1 ? 'solve' : 'solves'}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          {challenge.files && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                <div className="space-y-2">
                  {JSON.parse(challenge.files).map((file: string, index: number) => {
                    const filename = file.split('/').pop() || file;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono flex-1">{filename}</span>
                        <a href={file} download>
                          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Separator />

          <FlagSubmissionForm
            challengeId={challenge.id}
            solved={userSolved}
            correctFlag={userSolved ? challenge.flag : undefined}
          />

          {challenge.solves.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">First Solves</h3>
                <div className="space-y-2">
                  {challenge.solves.map((solve: { id: string; points: number; team: { name: string } | null; user: { username: string } }, index: number) => (
                    <div
                      key={solve.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">
                          {solve.team?.name || solve.user.username}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {solve.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}