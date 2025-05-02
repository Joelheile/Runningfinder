import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { and, asc, eq, gt, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

const VALID_DIFFICULTIES = ["easy", "intermediate", "advanced"] as const;
type Difficulty = (typeof VALID_DIFFICULTIES)[number];

function parseQueryParams(searchParams: URLSearchParams) {
  const weekdays = searchParams.get("weekdays")?.split(",").map(Number) || [];
  const difficulty = searchParams.get("difficulty") as Difficulty | null;
  const clubId = searchParams.get("clubId");

  return {
    weekdays: weekdays.filter(
      (day) => Number.isInteger(day) && day >= 1 && day <= 7,
    ),
    difficulty: VALID_DIFFICULTIES.includes(difficulty as Difficulty)
      ? difficulty
      : null,
    clubId,
  };
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
  try {
    const { searchParams } = new URL(request.url);
    const { weekdays, difficulty, clubId } = parseQueryParams(searchParams);

    console.log("Query params:", { weekdays, difficulty, clubId });

<<<<<<< HEAD
    const now = new Date();
    console.log("Current date:", now);

    const conditions = [eq(runs.isApproved, true), gt(runs.datetime, now)];

=======
    // Get current date
    const now = new Date();
    console.log("Current date:", now);

    const conditions = [
      
      
    ];

    // Add clubId filter if provided
>>>>>>> origin/main
    if (clubId) {
      conditions.push(eq(runs.clubId, clubId));
    }

<<<<<<< HEAD
=======
    // Add weekday filter if provided
>>>>>>> origin/main
    if (weekdays.length > 0) {
      conditions.push(inArray(runs.weekday, weekdays));
    }

<<<<<<< HEAD
=======
    // Add difficulty filter if provided
>>>>>>> origin/main
    if (difficulty) {
      conditions.push(eq(runs.difficulty, difficulty));
    }

<<<<<<< HEAD
=======
    // Get all runs with the specified conditions
>>>>>>> origin/main
    const runsData = await db
      .select({
        id: runs.id,
        name: runs.name,
        difficulty: runs.difficulty,
        clubId: runs.clubId,
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
<<<<<<< HEAD
      .where(and(...conditions))

      .orderBy(asc(runs.datetime));

=======
      .where(and(eq(runs.isApproved, true), gt(runs.datetime, now)),
      )
      .orderBy(asc(runs.datetime));

    console.log("Fetched runs from database:", runsData);

    // Transform the data to include a location object
>>>>>>> origin/main
    const transformedRuns = runsData.map((run: any) => ({
      ...run,
      location: {
        lat: run.locationLat,
        lng: run.locationLng,
      },
    }));

<<<<<<< HEAD
=======
    console.log("Transformed runs:", transformedRuns);

>>>>>>> origin/main
    return NextResponse.json(transformedRuns);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

<<<<<<< HEAD
=======
    // Validate the date field
>>>>>>> origin/main
    if (!body.datetime) {
      return handleErrorResponse(
        new Error("Date is required"),
        "Date is required",
        400,
      );
    }

<<<<<<< HEAD
=======
    // Ensure date is a valid Date object
>>>>>>> origin/main
    const datetime = new Date(body.datetime);
    if (isNaN(datetime.getTime())) {
      return handleErrorResponse(
        new Error("Invalid date"),
        "Invalid date",
        400,
      );
    }

<<<<<<< HEAD
=======
    // Validate location coordinates
>>>>>>> origin/main
    if (!body.location?.lat || !body.location?.lng) {
      return handleErrorResponse(
        new Error("Location coordinates are required"),
        "Location coordinates are required",
        400,
      );
    }

<<<<<<< HEAD
    const weekday = ((datetime.getDay() + 6) % 7) + 1;

=======
    // Calculate weekday (1-7, where 1 is Monday)
    const weekday = ((datetime.getDay() + 6) % 7) + 1;

    // Create the run with flattened location fields
>>>>>>> origin/main
    const run = await db
      .insert(runs)
      .values({
        id: body.id,
        name: body.name,
        difficulty: body.difficulty,
        clubId: body.clubId,
        datetime,
        weekday,
        startDescription: body.startDescription,
        locationLat: body.location.lat,
        locationLng: body.location.lng,
        mapsLink: body.mapsLink,
        isRecurrent: body.isRecurrent,
        isApproved: body.isApproved,
        distance: body.distance,
      })
      .returning();

    return NextResponse.json(run[0]);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return handleErrorResponse(
        new Error("ID is required"),
        "ID is required",
        400,
      );
    }

    const deletedRun = await db.delete(runs).where(eq(runs.id, id)).returning();

    if (!deletedRun.length) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(deletedRun[0]);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
<<<<<<< HEAD

/**
 * @swagger
 * /api/runs:
 *   get:
 *     tags:
 *       - runs
 *     summary: List all available runs.
 *     description: Retrieves a list of all approved runs with optional filtering capabilities.
 *     parameters:
 *       - in: query
 *         name: weekdays
 *         schema:
 *           type: string
 *         description: Comma-separated list of weekdays (1-7, where 1 is Monday)
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, intermediate, advanced]
 *         description: Filter runs by difficulty level
 *       - in: query
 *         name: clubId
 *         schema:
 *           type: string
 *         description: Filter runs by club ID
 *     responses:
 *       200:
 *         description: A list of runs matching the filter criteria.
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
 *                   distance:
 *                     type: number
 *       500:
 *         description: Internal Server Error.
 *
 *   post:
 *     tags:
 *       - runs
 *     summary: Create a new run.
 *     description: Creates a new run entry in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - clubId
 *               - datetime
 *               - difficulty
 *               - location
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unique identifier for the run. Generated if not provided.
 *               name:
 *                 type: string
 *               clubId:
 *                 type: string
 *               datetime:
 *                 type: string
 *                 format: date-time
 *               difficulty:
 *                 type: string
 *                 enum: [easy, intermediate, advanced]
 *               distance:
 *                 type: number
 *               startDescription:
 *                 type: string
 *               location:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               mapsLink:
 *                 type: string
 *               isRecurrent:
 *                 type: boolean
 *                 default: false
 *               isApproved:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Run created successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     tags:
 *       - runs
 *     summary: Delete a run.
 *     description: Permanently removes a run from the database using a query parameter.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the run to delete
 *     responses:
 *       200:
 *         description: Run successfully deleted.
 *       404:
 *         description: Run not found.
 *       500:
 *         description: Internal Server Error.
 */
=======
>>>>>>> origin/main
