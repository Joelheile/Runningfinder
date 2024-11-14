import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  console.log("api slug", slug);
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  try {
    console.log("API: Fetching runs with club ID:", slug);
    const res = await db
      .select({
        id: runs.id,
        name: runs.name,
        clubId: runs.clubId,
        difficulty: runs.difficulty,
        date: runs.date,
        interval: runs.interval,
        intervalDay: runs.intervalDay,
        startDescription: runs.startDescription,
        startTime: runs.startTime,
        distance: runs.distance,
        location: {
          lat: runs.locationLat,
          lng: runs.locationLng,
        },
      })
      .from(runs)
      .where(eq(runs.clubId, slug))
      .execute();
    console.log("API: Fetched runs with club ID:", res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching runs with clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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