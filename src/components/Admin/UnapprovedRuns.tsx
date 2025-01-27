"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Button } from "@/components/UI/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/UI/hover-card";
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { useRunActions } from "@/lib/hooks/runs/useRunActions";
import { useUnapprovedRuns } from "@/lib/hooks/runs/useUnapprovedRuns";
import { Run } from "@/lib/types/Run";
import { Club } from "@/lib/types/Club";
import { useQueryClient } from "@tanstack/react-query";

import { UpdateRunData } from "@/lib/hooks/runs/useUpdateRun";
import { debounce } from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";

const DIFFICULTIES = ["EASY", "INTERMEDIATE", "ADVANCED"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

interface RunWithClub extends Run {
  club: Club;
}

export default function UnapprovedRuns() {
  const { data: runs, isLoading, error } = useUnapprovedRuns();
  const queryClient = useQueryClient();
  const { updateRun, approveRun, deleteRun } = useRunActions();

  const handleUpdateRun = async (runId: string, data: UpdateRunData) => {
    const updateData = {
      ...data,
      datetime: data.datetime ? new Date(data.datetime) : undefined,
      slug: runId,
    };
    updateRun.mutate(updateData);
  };

  const handleApproveRun = (runId: string) => {
    // Optimistically update the UI
    queryClient.setQueryData<RunWithClub[]>(
      ["runs", "unapproved"],
      (old) => old?.filter((run) => run.id !== runId) ?? []
    );

    approveRun.mutate(runId);
  };

  const handleDeleteRun = (runId: string) => {
    // Optimistically update the UI
    queryClient.setQueryData<RunWithClub[]>(
      ["runs", "unapproved"],
      (old) => old?.filter((run) => run.id !== runId) ?? []
    );

    deleteRun.mutate(runId);
  };

  const debouncedUpdateRun = debounce(handleUpdateRun, 500);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading unapproved runs</div>;
  if (!runs?.length) return <div>No unapproved runs</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Unapproved Runs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>
                <Input
                  defaultValue={run.name}
                  onChange={(e) =>
                    debouncedUpdateRun(run.id, {
                      name: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={run.club.avatarUrl}
                        alt={run.club.name}
                      />
                      <AvatarFallback>
                        {run.club.name.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div>
                      <h4 className="font-semibold">{run.club.name}</h4>
                      <p className="text-sm">{run.club.description}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Input
                    type="datetime-local"
                    defaultValue={run.datetime.toISOString().slice(0, 16)}
                    onChange={(e) => {
                      console.log("New date value:", e.target.value);
                      console.log(
                        "Converted to Date:",
                        new Date(e.target.value)
                      );
                      debouncedUpdateRun(run.id, {
                        datetime: new Date(e.target.value),
                      });
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={DIFFICULTIES.find(
                    (d) => d.toLowerCase() === run.difficulty?.toLowerCase()
                  )}
                  onValueChange={(value) =>
                    debouncedUpdateRun(run.id, { difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === "EASY"
                          ? "🟢 Easy"
                          : difficulty === "INTERMEDIATE"
                            ? "🟡 Intermediate"
                            : "🔴 Advanced"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={run.distance}
                  onChange={(e) =>
                    debouncedUpdateRun(run.id, { distance: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproveRun(run.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRun(run.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
