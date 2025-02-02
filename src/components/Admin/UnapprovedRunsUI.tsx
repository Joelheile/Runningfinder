"use client";

import { Button } from "@/components/UI/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/UI/hover-card";
import { Input } from "@/components/UI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import Image from "next/image";

const DIFFICULTIES = ["EASY", "INTERMEDIATE", "ADVANCED"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

interface RunWithClub extends Run {
  club: Club;
}

interface UnapprovedRunsUIProps {
  runs: RunWithClub[] | undefined;
  handleUpdateRun: (runId: string, updateData: Partial<Run>) => Promise<void>;
  handleApproveRun: (runId: string) => Promise<void>;
  handleDeleteRun: (runId: string) => Promise<void>;
}

export default function UnapprovedRunsUI({
  runs,
  handleUpdateRun,
  handleApproveRun,
  handleDeleteRun,
}: UnapprovedRunsUIProps) {
  if (!runs?.length) return <div>No unapproved runs</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Unapproved Runs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Distance</TableHead>
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
                    handleUpdateRun(run.id, { name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger className="cursor-pointer hover:underline">
                    {run.club.name}
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="flex-shrink-0">
                        {run.club.avatarUrl && (
                          <Image
                            src={run.club.avatarUrl}
                            alt={run.club.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          {run.club.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {run.club.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                <select
                  className="w-full p-2 border rounded"
                  value={run.difficulty}
                  onChange={(e) =>
                    handleUpdateRun(run.id, {
                      difficulty: e.target.value as Difficulty,
                    })
                  }
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  defaultValue={run.distance}
                  onChange={(e) =>
                    handleUpdateRun(run.id, {
                      distance: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={run.startDescription}
                  onChange={(e) =>
                    handleUpdateRun(run.id, {
                      startDescription: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="default"
                  onClick={() => handleApproveRun(run.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteRun(run.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
