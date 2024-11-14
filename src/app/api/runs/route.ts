import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { and, between, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

function parseQueryParams(searchParams: URLSearchParams) {
  const minDistanceParam = searchParams.get("minDistance");
  const maxDistanceParam = searchParams.get("maxDistance");
  const intervalDaysParam = searchParams.get("interval_day");
  const difficultyParam = searchParams.get("difficulty");

  const minDistance = minDistanceParam ? parseInt(minDistanceParam, 10) : null;
  const maxDistance = maxDistanceParam ? parseInt(maxDistanceParam, 10) : null;
  const intervalDays = intervalDaysParam
    ? intervalDaysParam.split(",").map(Number)
    : [];
  const difficulty = difficultyParam || null;

  return { minDistance, maxDistance, intervalDays, difficulty };
}

function handleErrorResponse(
  error: unknown,
  message = "Internal Server Error",
  status = 500,
) {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { minDistance, maxDistance, intervalDays, difficulty } =
    parseQueryParams(searchParams);

  try {
    const baseQuery = db
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
      .from(runs);

    // Initialize array
    const conditions = [eq(runs.membersOnly, false)];

    // Validate and add distance condition
    if (
      typeof minDistance === "number" &&
      typeof maxDistance === "number" &&
      minDistance >= 0 &&
      maxDistance >= minDistance
    ) {
      conditions.push(
        between(runs.distance, minDistance.toString(), maxDistance.toString()),
      );
    }

    // Validate and add interval days condition
    const validDays = intervalDays.filter(
      (day) => Number.isInteger(day) && day >= 1 && day <= 7,
    );
    if (validDays.length > 0) {
      conditions.push(inArray(runs.intervalDay, validDays));
    }

    const validDifficulties = ["easy", "intermediate", "advanced"];
    if (difficulty && validDifficulties.includes(difficulty)) {
      conditions.push(eq(runs.difficulty, difficulty));
    }

    // Query based on conditions
    if (conditions.length > 1) {
      baseQuery.where(and(...conditions));
    } else {
      baseQuery.where(eq(runs.membersOnly, false));
    }

    const result = await baseQuery.execute();
    return NextResponse.json(result);
  } catch (error) {
    return handleErrorResponse(error, "Error fetching runs");
  }
}

export async function POST(request: Request) {
  const runData = await request.json();

  try {
    const newRun = {
      ...runData,
      locationLng: runData.location.lng,
      locationLat: runData.location.lat,
    };

    await db.insert(runs).values(newRun).execute();

    return NextResponse.json(
      { message: "Run created successfully", run: newRun },
      { status: 201 },
    );
  } catch (error) {
    return handleErrorResponse(error, "Error creating run");
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await db.delete(runs).where(eq(runs.id, id)).execute();
    return NextResponse.json({ message: "Run deleted successfully" });
  } catch (error) {
    return handleErrorResponse(error, "Error deleting run");
  }
}

/**
 * @swagger
 * /api/runs:
 *   get:
 *     summary: Retrieve a list of runs
 *     tags:
 *       - runs
 *     description: Fetch runs based on various query parameters such as distance, interval days, and difficulty.
 *     parameters:
 *       - in: query
 *         name: minDistance
 *         schema:
 *           type: integer
 *         description: Minimum distance of the run in meters
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: integer
 *         description: Maximum distance of the run in meters
 *       - in: query
 *         name: interval_day
 *         schema:
 *           type: string
 *         description: Comma-separated list of interval days (1-7)
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, intermediate, advanced]
 *         description: Difficulty level of the run
 *     responses:
 *       200:
 *         description: A list of runs
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
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create a new run
 *     tags:
 *       - runs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               clubId:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               interval:
 *                 type: string
 *               intervalDay:
 *                 type: integer
 *               startDescription:
 *                 type: string
 *               startTime:
 *                 type: string
 *               distance:
 *                 type: number
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     responses:
 *       201:
 *         description: Run created successfully
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete a run
 *     tags:
 *       - runs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Run deleted successfully
 *       500:
 *         description: Internal Server Error
 */
