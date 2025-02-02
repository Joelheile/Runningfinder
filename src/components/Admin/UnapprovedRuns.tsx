"use client";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { useRunActions } from "@/lib/hooks/runs/useRunActions";
import { useUnapprovedRuns } from "@/lib/hooks/runs/useUnapprovedRuns";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
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
  const { updateRun, approveRun, deleteRun } = useRunActions();
  const queryClient = useQueryClient();


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading unapproved runs</div>;
  if (!runs?.length) return <div>No unapproved runs</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Unapproved Runs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Start Description</TableHead>
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
                    debouncedUpdateRun(run.id, { name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>{run.club?.name}</TableCell>
              <TableCell>
                <Input
                  type="datetime-local"
                  defaultValue={run.datetime?.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    debouncedUpdateRun(run.id, {
                      datetime: new Date(e.target.value),
                    })
                  }
                />
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
                <Input
                  defaultValue={run.difficulty}
                  onChange={(e) =>
                    debouncedUpdateRun(run.id, { difficulty: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={run.startDescription}
                  onChange={(e) =>
                    debouncedUpdateRun(run.id, {
                      startDescription: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveRun(run.id)}
                    variant="secondary"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleDeleteRun(run.id)}
                    variant="destructive"
                    size="sm"
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
