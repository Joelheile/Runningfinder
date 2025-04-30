import { db } from "@/lib/db/db";
import { clubs, runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const unapprovedRuns = await db
      .select({
        id: runs.id,
        name: runs.name,
        difficulty: runs.difficulty,
        clubId: runs.clubId,
        club: {
          id: clubs.id,
          name: clubs.name,
          description: clubs.description,
          instagramUsername: clubs.instagramUsername,
          stravaUsername: clubs.stravaUsername,
          avatarUrl: clubs.avatarUrl,
        },
        datetime: runs.datetime,
        weekday: runs.weekday,
        startDescription: runs.startDescription,
        locationLng: runs.locationLng,
        locationLat: runs.locationLat,
        mapsLink: runs.mapsLink,
        isRecurrent: runs.isRecurrent,
        isApproved: runs.isApproved,
        distance: runs.distance,
      })
      .from(runs)
      .leftJoin(clubs, eq(runs.clubId, clubs.id))
      .where(eq(runs.isApproved, false));

    return NextResponse.json(unapprovedRuns, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching unapproved runs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/runs/unapproved:
 *   get:
 *     tags:
 *       - runs
 *       - admin
 *     summary: Retrieve all unapproved runs.
 *     description: Admin-only endpoint to fetch all pending run approvals with their associated club information.
 *     responses:
 *       200:
 *         description: A list of unapproved runs with their club details.
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
 *                   difficulty:
 *                     type: string
 *                     enum: [easy, intermediate, advanced]
 *                   clubId:
 *                     type: string
 *                   club:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       instagramUsername:
 *                         type: string
 *                       stravaUsername:
 *                         type: string
 *                       avatarUrl:
 *                         type: string
 *                   datetime:
 *                     type: string
 *                     format: date-time
 *                   weekday:
 *                     type: integer
 *                   startDescription:
 *                     type: string
 *                   locationLng:
 *                     type: number
 *                   locationLat:
 *                     type: number
 *                   mapsLink:
 *                     type: string
 *                   isRecurrent:
 *                     type: boolean
 *                   isApproved:
 *                     type: boolean
 *                   distance:
 *                     type: number
 *       401:
 *         description: Unauthorized - Admin access required.
 *       500:
 *         description: Internal Server Error.
 */
