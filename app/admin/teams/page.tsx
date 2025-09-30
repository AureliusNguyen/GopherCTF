import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamManagementTable } from "@/components/admin/team-management-table";

async function getTeams() {
  const teams = await prisma.team.findMany({
    include: {
      _count: {
        select: {
          members: true,
          solves: true,
        },
      },
    },
    orderBy: {
      score: "desc",
    },
  });

  return teams;
}

export default async function AdminTeamsPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <p className="text-muted-foreground">
          Manage teams, disable them, or remove them from the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teams ({teams.length})</CardTitle>
          <CardDescription>
            View and manage all teams. Toggle the switch to enable/disable teams, or
            click the delete button to permanently remove a team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamManagementTable teams={teams} />
        </CardContent>
      </Card>
    </div>
  );
}