import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users, Calendar } from "lucide-react";

async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      team: true,
      solves: {
        include: {
          challenge: {
            include: {
              category: true
            }
          }
        },
        orderBy: { solvedAt: 'desc' }
      }
    }
  });

  // Create user if doesn't exist
  if (!user && clerkUser) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        username: clerkUser.username || clerkUser.firstName || "User",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
      include: {
        team: true,
        solves: {
          include: {
            challenge: {
              include: {
                category: true
              }
            }
          },
          orderBy: { solvedAt: 'desc' }
        }
      }
    });
  }

  if (!user) redirect("/sign-in");

  const totalScore = user.solves.reduce((sum: number, solve: { points: number }) => sum + solve.points, 0);

  return { user, totalScore };
}

export default async function ProfilePage() {
  const { user, totalScore } = await getUserProfile();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Your stats and achievements
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.imageUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              {user.team && (
                <Badge className="mt-2" variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  Team: {user.team.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Score
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalScore}</div>
            <p className="text-xs text-muted-foreground">
              points earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Challenges Solved
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.solves.length}</div>
            <p className="text-xs text-muted-foreground">
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Member Since
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              joined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Solves */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Solves</CardTitle>
          <CardDescription>
            Your latest challenge completions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.solves.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No solves yet. Start solving challenges!
            </div>
          ) : (
            <div className="space-y-3">
              {user.solves.slice(0, 10).map((solve) => (
                <div
                  key={solve.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{
                        backgroundColor: `${solve.challenge.category.color}20`,
                        color: solve.challenge.category.color,
                        borderColor: solve.challenge.category.color,
                      }}
                      className="border"
                    >
                      {solve.challenge.category.name}
                    </Badge>
                    <span className="font-medium">{solve.challenge.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-primary">
                      +{solve.points} pts
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(solve.solvedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}