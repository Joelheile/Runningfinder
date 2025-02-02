import { Button } from "@/components/UI/button";
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
import Image from "next/image";
import { Textarea } from "../UI/textarea";

interface UnapprovedClubsUIProps {
  clubs: Club[] | undefined;
  handleInstagramFetch: (slug: string, username: string) => Promise<void>;
  handleUpdateClub: (slug: string, updateData: Partial<Club>) => Promise<void>;
  handleApproveClub: (slug: string) => Promise<void>;
  handleClubDecline: (slug: string) => Promise<void>;
}

export default function UnapprovedClubsUI({
  clubs,
  handleInstagramFetch,
  handleUpdateClub,
  handleApproveClub,
  handleClubDecline,
}: UnapprovedClubsUIProps) {
  if (!clubs) return <div>No unapproved clubs</div>;

  return (
    <div className="w-full max-w-[95%] mx-auto py-10 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Name</TableHead>
            <TableHead className="w-[25%]">Description</TableHead>
            <TableHead className="w-[20%]">Instagram</TableHead>
            <TableHead className="w-[20%]">Website</TableHead>
            <TableHead className="w-[20%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell className="flex flex-col items-center p-4">
                <div className="flex justify-center w-full mb-4">
                  <div className="relative w-24 h-24">
                    <Image
                      fill
                      src={club.avatarUrl || "/assets/default-club-avatar.png"}
                      alt={`${club.name} avatar`}
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
                <Input
                  className="text-center font-medium"
                  defaultValue={club.name}
                  onChange={(e) =>
                    handleUpdateClub(club.slug, { name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell className="align-top p-4 whitespace-normal">
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder="Description"
                    defaultValue={club.description}
                    onChange={(e) =>
                      handleUpdateClub(club.slug, {
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="align-top p-4">
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Instagram username"
                    defaultValue={club.instagramUsername}
                    onChange={(e) =>
                      handleInstagramFetch(club.slug, e.target.value)
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="align-top p-4">
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Strava username"
                    defaultValue={club.stravaUsername}
                    onChange={(e) =>
                      handleUpdateClub(club.slug, {
                        stravaUsername: e.target.value,
                      })
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="align-top p-4">
                <Input
                  placeholder="Website URL"
                  defaultValue={club.websiteUrl}
                  onChange={(e) =>
                    handleUpdateClub(club.slug, {
                      websiteUrl: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell className="align-top p-4">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleApproveClub(club.slug)}
                    variant="default"
                    className="w-full"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleClubDecline(club.slug)}
                    variant="destructive"
                    className="w-full"
                  >
                    Decline
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
