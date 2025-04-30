import { db } from "@/lib/db/db";
import { clubs as club } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const DEFAULT_FALLBACK_IMAGE_URL = "/assets/default-fallback-image.png";

export async function GET() {
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        description: club.description,
        avatarUrl: club.avatarUrl,
        creationDate: club.creationDate,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        slug: club.slug,
      })
      .from(club)
      .where(eq(club.isApproved, false)).orderBy(club.creationDate)

    const clubsWithFallbackAvatar = res.map((club: { avatarUrl: any }) => ({
      ...club,
      avatarUrl: club.avatarUrl || DEFAULT_FALLBACK_IMAGE_URL,
    }));

    return NextResponse.json(clubsWithFallbackAvatar);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/clubs/unapproved:
 *   get:
 *     tags:
 *       - clubs
 *       - admin
 *     summary: Retrieve all unapproved clubs.
 *     description: Admin-only endpoint to fetch all pending club approvals.
 *     responses:
 *       200:
 *         description: A list of unapproved clubs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   avatarUrl:
 *                     type: string
 *                   creationDate:
 *                     type: string
 *                     format: date-time
 *                   instagramUsername:
 *                     type: string
 *                   websiteUrl:
 *                     type: string
 *                   slug:
 *                     type: string
 *       401:
 *         description: Unauthorized - Admin access required.
 *       500:
 *         description: Internal Server Error.
 */