"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Users } from "lucide-react";

type Team = {
  id: string;
  name: string;
  score: number;
  disabled: boolean;
  _count: {
    members: number;
    solves: number;
  };
};

export function TeamManagementTable({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleDisabled = async (teamId: string) => {
    setLoading(teamId);
    try {
      const response = await fetch(`/api/admin/teams/${teamId}/toggle-disabled`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to toggle team status");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling team status:", error);
      alert("Failed to toggle team status");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    setLoading(teamToDelete.id);
    try {
      const response = await fetch(`/api/admin/teams/${teamToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to delete team");
        return;
      }

      router.refresh();
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team");
    } finally {
      setLoading(null);
    }
  };

  const openDeleteDialog = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead className="text-center">Solves</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No teams found
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{team._count.members}</Badge>
                </TableCell>
                <TableCell className="text-center">{team._count.solves}</TableCell>
                <TableCell className="text-center">
                  <span className="font-bold text-primary">{team.score}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={!team.disabled}
                      onCheckedChange={() => handleToggleDisabled(team.id)}
                      disabled={loading === team.id}
                    />
                    <span className="text-sm text-muted-foreground">
                      {team.disabled ? "Disabled" : "Active"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(team)}
                    disabled={loading === team.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team{" "}
              <span className="font-semibold">{teamToDelete?.name}</span> and all their
              submissions and solves. Team members will be moved to solo status. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}