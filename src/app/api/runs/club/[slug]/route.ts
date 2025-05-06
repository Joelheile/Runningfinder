import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { Run } from "@/lib/types/Run";
import { and, eq } from "drizzle-orm";
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
    console.log("Fetching runs for club:", slug);

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
      .where(and(eq(runs.isApproved, true), eq(runs.clubId, slug)));

    const pastRuns = runsData.map((run: Run) => ({
      ...run,
      isPast: run.datetime < now,
    }));

    return NextResponse.json(pastRuns);
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
 * /api/runs/club/{slug}:
 *   get:
 *     tags:
 *       - runs
 *       - clubs
 *     summary: Retrieve all runs for a specific club.
 *     description: Returns a list of all approved, upcoming runs organized by a particular club.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Club ID to fetch runs for
 *     responses:
 *       200:
 *         description: List of club runs.
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
 *                     enum: [easy, intermediate, advanced]
 *                   datetime:
 *                     type: string
 *                     format: date-time
 *                   weekday:
 *                     type: integer
 *                     description: Day of the week (1-7, where 1 is Monday)
 *                   startDescription:
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
 *                   mapsLink:
 *                     type: string
 *                   isRecurrent:
 *                     type: boolean
 *                   isApproved:
 *                     type: boolean
 *                   isPast:
 *                     type: boolean
 *       400:
 *         description: Club ID is required.
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Failed to fetch runs.
 */
