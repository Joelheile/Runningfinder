import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "Club ID is required" }, { status: 400 });
  }
  const now = new Date();
  try {
    console.log('Fetching runs for club:', slug);
    
    const runsData = await db
      .select({
        id: runs.id,
        name: runs.name,
        clubId: runs.clubId,
        difficulty: runs.difficulty,
        datetime: runs.datetime,
        weekday: runs.weekday,
        startDescription: runs.startDescription,
        distance: runs.distance,
        location: {
          lat: runs.locationLat,
          lng: runs.locationLng,
        },
        mapsLink: runs.mapsLink,
        isRecurrent: runs.isRecurrent,
        isApproved: runs.isApproved,
      })
      .from(runs)
      .where(
        and(
          eq(runs.isApproved, true),
          eq(runs.clubId, slug),

            gt(runs.datetime, now),
        )

      )




    return NextResponse.json(runsData);
  } catch (error) {
    console.error("Error fetching runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch runs" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/runs/{slug}:
 *   get:
 *     summary: Retrieve runs for a specific club
 *     tags:
 *       - runs
 *     description: Fetches all runs associated with a given club ID (slug).
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The club ID (slug) to fetch runs for
 *     responses:
 *       200:
 *         description: A list of runs for the specified club
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
 *                   clubId:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   interval:
 *                     type: string
 *                   intervalDay:
 *                     type: integer
 *                   startDescription:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                   distance:
 *                     type: number
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *       400:
 *         description: Bad Request - slug is required
 *       500:
 *         description: Internal Server Error
 */
