"use client";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { useClubActions } from "@/lib/hooks/clubs/useClubActions";
import { useUnapprovedClubs } from "@/lib/hooks/clubs/useUnapprovedClubs";
import useGetProfileImage from "@/lib/hooks/scraping/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";

export default function UnapprovedClubs() {
  const { data: clubs, isLoading, error } = useUnapprovedClubs();
  const { updateClub, approveClub, deleteClub } = useClubActions();
  const getProfileImage = useGetProfileImage();

  const handleUpdateClub = async (club: Club, data: Partial<Club>) => {
    // Debug toast for what's being updated
    toast(`Updating field: ${Object.keys(data).join(", ")}`);
    console.log("Update data:", data);

    // If Instagram username is being updated, fetch profile data
    if (data.instagramUsername !== undefined) {
      toast(`Fetching Instagram profile for @${data.instagramUsername}`);
      try {
        const profile = await getProfileImage.getProfileImage({
          instagramUsername: data.instagramUsername,
        });

        toast("Got Instagram profile, updating club data...");
        console.log("Instagram profile data:", profile);

        // Update with Instagram data
        data = {
          ...data,
          avatarUrl: profile.profileImageUrl || undefined,
          description: profile.profileDescription || data.description,
        };

        // Show toast notification
        toast.success("Instagram profile data retrieved!");
      } catch (error) {
        console.error("Failed to fetch Instagram profile:", error);
        toast.error("Failed to fetch Instagram profile.");
        return; // Don't proceed with update if Instagram fetch fails
      }
    }

    // Explicitly ensure we're not setting isApproved
    delete data.isApproved;

    // Debug what's being sent to the server
    console.log("Final update data:", data);
    toast("Sending update to server...");

    try {
      await updateClub.mutateAsync({ ...data, slug: club.slug });
      toast.success("Club updated successfully!");
    } catch (error) {
      console.error("Failed to update club:", error);
      toast.error("Failed to update club");
    }
  };

  const debouncedUpdateClub = debounce(handleUpdateClub, 500);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading unapproved clubs</div>;
  if (!clubs?.length) return <div>No unapproved clubs</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Unapproved Clubs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Instagram</TableHead>
            <TableHead>Strava</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell className="flex flex-row items-center gap-4">
                <div className="w-10 h-10 flex-shrink-0">
                  <img
                    src={club.avatarUrl || "/assets/default-club-avatar.png"}
                    alt={`${club.name} avatar`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
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
                  defaultValue={club.instagramUsername || ""}
                  placeholder="Instagram username"
                  onChange={(e) =>
                    debouncedUpdateClub(club, {
                      instagramUsername: e.target.value || "",
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  defaultValue={club.stravaUsername || ""}
                  placeholder="Strava username"
                  onChange={(e) =>
                    debouncedUpdateClub(club, {
                      stravaUsername: e.target.value || "",
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => approveClub.mutate(club.slug)}
                    className="bg-green-600 hover:bg-green-700 text-white"
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
