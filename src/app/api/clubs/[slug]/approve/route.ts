import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const existingClub = await db
      .select()
      .from(clubs)
      .where(eq(clubs.slug, params.slug));

    if (!existingClub.length) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    console.log("Existing club before update:", {
      slug: existingClub[0].slug,
      isApproved: existingClub[0].isApproved,
    });

    console.log("Starting club update for slug:", params.slug);

    const updatedClub = await db
      .update(clubs)
      .set({ isApproved: true })
      .where(eq(clubs.slug, params.slug))
      .returning();

    console.log("Update query completed. Result:", updatedClub);

    if (!updatedClub.length) {
      console.error("Club update failed - no rows returned");
      throw new Error("Club update failed - no rows returned");
    }

    console.log("Updated club details:", {
      slug: updatedClub[0].slug,
      isApproved: updatedClub[0].isApproved,
      updatedAt: updatedClub[0].updatedAt,
    });

    if (!updatedClub[0].isApproved) {
      console.error("Club update failed - isApproved is still false");
      throw new Error("Club update failed - isApproved is not true");
    }

    console.log("Update successful:", {
      slug: updatedClub[0].slug,
      isApproved: updatedClub[0].isApproved,
    });

    return NextResponse.json(updatedClub[0]);
  } catch (error) {
    console.error("Error approving club:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/clubs/{slug}/approve:
 *   post:
 *     tags:
 *       - clubs
 *       - admin
 *     summary: Approve a club.
 *     description: Admin-only endpoint to approve a club for public visibility.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique slug identifier of the club to approve

 *     responses:
 *       200:
 *         description: Club approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 creationDate:
 *                   type: string
 *                   format: date-time
 *                 instagramUsername:
 *                   type: string
 *                 websiteUrl:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 isApproved:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - Admin access required.
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Internal Server Error.
 */
