"use client";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { useClubActions } from "@/lib/hooks/clubs/useClubActions";
import { useUnapprovedClubs } from "@/lib/hooks/clubs/useUnapprovedClubs";
import useGetProfileImage from "@/lib/hooks/scraping/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import Image from "next/image";
import { useEffect } from "react";
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
  const queryClient = useQueryClient();

  const handleUpdateClub = async (club: Club, data: Partial<Club>) => {
    // Debug toast for what's being updated
    toast("🔄 Updating field: " + Object.keys(data).join(", "));

    // If Instagram username is being updated, fetch profile data
    if (data.instagramUsername !== undefined) {
      toast("📸 Fetching Instagram profile for @" + data.instagramUsername);
      try {
        const profile = await getProfileImage.getProfileImage({
          instagramUsername: data.instagramUsername,
        });

        toast("📥 Got Instagram profile, updating club data...");

        // Update with Instagram data
        data = {
          ...data,
          avatarUrl: profile.profileImageUrl || undefined,
          description: profile.profileDescription || data.description,
        };

        // Show toast notification
        toast.success("✨ Instagram profile data retrieved!");
      } catch (error) {
        console.error("Failed to fetch Instagram profile:", error);
        toast.error("❌ Failed to fetch Instagram profile.");
        return; // Don't proceed with update if Instagram fetch fails
      }
    }

    // Explicitly ensure we're not setting isApproved
    delete data.isApproved;

    // Debug what's being sent to the server
    console.log("Final update data:", data);
    toast("📤 Sending update to server...");

    try {
      await updateClub.mutateAsync({ ...data, slug: club.slug });
      toast.success("✅ Club updated successfully!");
    } catch (error) {
      console.error("Failed to update club:", error);
      toast.error("❌ Failed to update club");
    }
  };

  const debouncedUpdateClub = debounce(handleUpdateClub, 500);

  const handleApproveClub = async (slug: string) => {
    try {
      // First remove from cache optimistically
      queryClient.setQueryData<Club[]>(
        ["unapprovedClubs"],
        (old) => old?.filter((club) => club.slug !== slug) ?? []
      );

      // Perform the approval
      const result = await approveClub.mutateAsync(slug);
      console.log('Club approval result:', result);
      
      // Force immediate refetch
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["unapprovedClubs"],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: ["clubs"],
          refetchType: "active",
        })
      ]);
      
      // Remove from cache again after server confirmation
      queryClient.setQueryData<Club[]>(
        ["unapprovedClubs"],
        (old) => old?.filter((club) => club.slug !== slug) ?? []
      );
      
      toast.success("Club approved successfully");
    } catch (error) {
      console.error("Error approving club:", error);
      toast.error("Failed to approve club");
      
      // Refetch to ensure UI is in sync with server
      await queryClient.invalidateQueries({
        queryKey: ["unapprovedClubs"],
        refetchType: "active"
      });
    }
  };

  useEffect(() => {
    if (clubs) {
      clubs.forEach((club) => {
        console.log(`Club ${club.name} avatar URL at render:`, club.avatarUrl);
      });
    }
  }, [clubs]);

  console.log("unnaproved clubs", clubs);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading unapproved clubs</div>;
  if (!clubs?.length) return <div>No unapproved clubs</div>;

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
          {clubs
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
                    onChange={(e) =>
                      debouncedUpdateClub(club, { name: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <textarea
                    className="w-full min-h-[120px] p-2 rounded-md border border-gray-300 resize-y bg-white"
                    defaultValue={club.description}
                    onChange={(e) =>
                      debouncedUpdateClub(club, { description: e.target.value })
                    }
                    placeholder="Club description..."
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <Input
                    placeholder="Instagram username"
                    defaultValue={club.instagramUsername}
                    onChange={(e) =>
                      debouncedUpdateClub(club, {
                        instagramUsername: e.target.value || "",
                      })
                    }
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <Input
                    placeholder="Strava username"
                    defaultValue={club.stravaUsername}
                    onChange={(e) =>
                      debouncedUpdateClub(club, {
                        stravaUsername: e.target.value || "",
                      })
                    }
                  />
                </TableCell>
                <TableCell className="align-top p-4">
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
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
