"use client";

import { Input } from "@/components/UI/input";
import useApproveClub from "@/lib/hooks/scraping/useApproveClub";
import useDeclineClub from "@/lib/hooks/scraping/useDeclineClub";
import useFetchClubs from "@/lib/hooks/scraping/useFetchClubs";
import getInstagramProfile from "@/lib/hooks/scraping/useGetInstagramProfile";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "../UI/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";

import useUpdateAdminClub from "@/lib/hooks/scraping/useUpdateAdminClub";
import { Club } from "@/lib/types/Club";
import { useRouter } from "next/navigation";

export default function UnapprovedClubs() {
  const router = useRouter();
  const { clubs, refetch } = useFetchClubs();
  if (!clubs) return <div>No unapproved clubs</div>;

  const handleUpdateClub = async (slug: string, updateData: Partial<Club>) => {
    try {
      await useUpdateAdminClub(slug, updateData);
      await refetch();

      router.refresh();
    } catch (error) {
      console.error("Failed to update club:", error);
      toast.error("Failed to update club");
    }
  };

  async function handleApproveClub(id: string) {
    const approve = await useApproveClub(id);
    approve();
    router.refresh();

    refetch();
  }

  async function handleClubDecline(slug: string) {
    const decline = await useDeclineClub(slug);
    decline();
    refetch();

    router.refresh();
  }

  const handleInstagramFetch = async (slug: string, username: string) => {
    if (!username) return;

    const loadingToast = toast.loading("Fetching Instagram profile...");
    try {
      const instagramScrape = await getInstagramProfile({
        instagramUsername: username,
      });
      console.log("Instagram scrape result:", instagramScrape);

      await handleUpdateClub(slug, {
        avatarUrl:
          instagramScrape.profileImageUrl ||
          "/assets/default-fallback-image.png",
        description: instagramScrape.profileDescription || "",
      });

      toast.success("Instagram profile fetched and updated successfully", {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      toast.error("Failed to fetch Instagram profile", { id: loadingToast });
    }
  };

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
                    onChange={(e) =>
                      handleUpdateClub(club.slug, { name: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <textarea
                    className="w-full min-h-[120px] p-2 rounded-md border border-gray-300 resize-y bg-white"
                    defaultValue={club.description}
                    onChange={(e) =>
                      handleUpdateClub(club.slug, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Club description..."
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <Input
                    placeholder="Instagram username"
                    defaultValue={club.instagramUsername}
                    onChange={(e) =>
                      handleUpdateClub(club.slug, {
                        instagramUsername: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleInstagramFetch(club.slug, e.currentTarget.value);
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="align-top p-4">
                  <Input
                    placeholder="Strava username"
                    defaultValue={club.stravaUsername}
                    onChange={(e) =>
                      handleUpdateClub(club.slug, {
                        stravaUsername: e.target.value,
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
                      onClick={() => handleClubDecline(club.slug)}
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
