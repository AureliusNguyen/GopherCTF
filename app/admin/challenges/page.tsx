import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChallengeVisibilityToggle } from "@/components/admin/challenge-visibility-toggle";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";
import Link from "next/link";

async function getAllChallenges() {
  const challenges = await prisma.challenge.findMany({
    include: {
      category: true,
      _count: {
        select: { solves: true }
      }
    },
    orderBy: [
      { visible: 'desc' },
      { category: { name: 'asc' } },
      { createdAt: 'desc' }
    ]
  });

  return challenges;
}

export default async function AdminChallengesPage() {
  const challenges = await getAllChallenges();

  const visibleCount = challenges.filter(c => c.visible).length;
  const hiddenCount = challenges.filter(c => !c.visible).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Challenge Management</h1>
          <p className="text-muted-foreground">
            Manage challenge visibility and settings
          </p>
        </div>
        <Link href="/admin/challenges/new">
          <Button className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            New Challenge
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challenges.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visible</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{visibleCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{hiddenCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
          <CardDescription>
            Toggle visibility to show or hide challenges from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visible</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Solves</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
                <TableRow key={challenge.id} className={!challenge.visible ? "opacity-50" : ""}>
                  <TableCell>
                    <ChallengeVisibilityToggle
                      challengeId={challenge.id}
                      initialVisible={challenge.visible}
                      title={challenge.title}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{challenge.title}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{challenge.difficulty}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{challenge.basePoints}</TableCell>
                  <TableCell className="text-right">{challenge._count.solves}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/challenges/${challenge.id}/edit`}>
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}