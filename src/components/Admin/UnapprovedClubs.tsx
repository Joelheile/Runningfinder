"use client";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { useClubActions } from "@/lib/hooks/clubs/useClubActions";
import { useUnapprovedClubs } from "@/lib/hooks/clubs/useUnapprovedClubs";
import { debounce } from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";

interface Club {
  id: string;
  name: string;
  description: string;
  instagramUsername?: string;
  stravaUsername?: string;
  websiteUrl?: string;
  isApproved: boolean;
  slug: string;
}

export default function UnapprovedClubs() {
  const { data: clubs, isLoading, error } = useUnapprovedClubs();
  const { updateClub, approveClub, deleteClub } = useClubActions();

  const handleUpdateClub = async (club: Club, data: Partial<Club>) => {
    updateClub.mutate({ ...data, slug: club.slug });
  };

  const debouncedUpdateClub = debounce(handleUpdateClub, 500);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading unapproved clubs</div>;
  if (!clubs?.length) return <div>No unapproved clubs</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Unapproved Clubs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Instagram</TableHead>
            <TableHead>Strava</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell>
                <Input
                  defaultValue={club.name}
                  onChange={(e) =>
                    debouncedUpdateClub(club, { name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Textarea
                  defaultValue={club.description}
                  onChange={(e) =>
                    debouncedUpdateClub(club, { description: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={club.instagramUsername}
                  onChange={(e) =>
                    debouncedUpdateClub(club, { instagramUsername: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={club.stravaUsername}
                  onChange={(e) =>
                    debouncedUpdateClub(club, { stravaUsername: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={club.websiteUrl}
                  onChange={(e) =>
                    debouncedUpdateClub(club, { websiteUrl: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => approveClub.mutate(club.slug)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteClub.mutate(club.slug)}
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
