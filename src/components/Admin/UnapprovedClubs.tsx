"use client";

import { Input } from "@/components/UI/input";
import useFetchClubs from "@/lib/hooks/scraping/useFetchClubs";
import { Club } from "@/lib/types/Club";
import Image from "next/image";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";

export default function UnapprovedClubs() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [stravaUsername, setStravaUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/assets/default-fallback-image.png"
  );

  const clubs: Club[] = useFetchClubs();

  console.log("clubs:", clubs);
  if (!clubs) return <div>No unapproved clubs</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Unapproved Clubs</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/5 font-semibold text-center">
              Club Info
            </TableHead>
            <TableHead className="w-2/5 font-semibold">Description</TableHead>
            <TableHead className="w-1/5 font-semibold">Instagram</TableHead>
            <TableHead className="w-1/5 font-semibold">Strava</TableHead>
            <TableHead className="w-48 font-semibold text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(clubs ?? [])
            .filter((club) => !club.isApproved)
            .map((club) => (
              <TableRow key={club.id} className="hover:bg-gray-50">
                <TableCell className="flex flex-col items-center p-4">
                  <div className="flex justify-center w-full mb-4">
                    <div className="relative w-24 h-24">
                      <Image
                        fill
                        src={
                          club.avatarUrl || "/assets/default-club-avatar.png"
                        }
                        alt={`${club.name} avatar`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <Input
                    className="text-center font-medium"
                    defaultValue={club.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <textarea
                    className="w-full min-h-[120px] p-2 rounded-md border border-gray-300 resize-y bg-white"
                    defaultValue={club.description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Club description..."
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <Input
                    placeholder="Instagram username"
                    defaultValue={club.instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <Input
                    placeholder="Strava username"
                    defaultValue={club.stravaUsername}
                    onChange={(e) => setStravaUsername(e.target.value)}
                  />
                </TableCell>
                {/* <TableCell className="align-top p-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleApproveClub(club.slug)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => deleteClub.mutate(club.slug)}
                      variant="destructive"
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
