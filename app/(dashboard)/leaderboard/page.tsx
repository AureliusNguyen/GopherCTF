import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getLeaderboardData() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  // Get top teams
  const teams = await prisma.team.findMany({
    orderBy: { score: 'desc' },
    take: 50,
    include: {
      members: true,
      solves: {
        orderBy: { solvedAt: 'desc' },
        take: 1
      }
    }
  });

  // Get top individuals (users without teams, excluding admins)
  const individuals = await prisma.user.findMany({
    where: {
      teamId: null,
      isAdmin: false
    },
    orderBy: { solves: { _count: 'desc' } },
    take: 50,
    include: {
      solves: {
        orderBy: { solvedAt: 'desc' }
      }
    }
  });

  // Calculate individual scores
  const individualsWithScores = individuals.map(user => ({
    ...user,
    totalScore: user.solves.reduce((sum, solve) => sum + solve.points, 0),
    lastSolve: user.solves[0]?.solvedAt || null
  })).sort((a, b) => b.totalScore - a.totalScore);

  return { teams, individuals: individualsWithScores };
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-700" />;
    default:
      return <span className="text-muted-foreground">#{rank}</span>;
  }
}

export default async function LeaderboardPage() {
  const { teams, individuals } = await getLeaderboardData();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performers across all challenges
        </p>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="teams" className="cursor-pointer">Teams</TabsTrigger>
          <TabsTrigger value="individuals" className="cursor-pointer">Individuals</TabsTrigger>
        </TabsList>

        {/* Teams Leaderboard */}
        <TabsContent value="teams" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Rankings</CardTitle>
              <CardDescription>
                Teams with the highest cumulative scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teams yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Members</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Last Solve</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team, index) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">
                          {getRankIcon(index + 1)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {team.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {team.members.length}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary">
                            {team.score}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {team.solves[0]?.solvedAt
                            ? new Date(team.solves[0].solvedAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individuals Leaderboard */}
        <TabsContent value="individuals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Rankings</CardTitle>
              <CardDescription>
                Top solo competitors without a team
              </CardDescription>
            </CardHeader>
            <CardContent>
              {individuals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No individual competitors yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Solves</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Last Solve</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {individuals.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {getRankIcon(index + 1)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.imageUrl || undefined} />
                              <AvatarFallback>
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.solves.length}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary">
                            {user.totalScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {user.lastSolve
                            ? new Date(user.lastSolve).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}