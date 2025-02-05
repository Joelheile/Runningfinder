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

    // Get current date
    const now = new Date();
    console.log("Current date:", now);

    const conditions = [
      
      
    ];

    // Add clubId filter if provided
    if (clubId) {
      conditions.push(eq(runs.clubId, clubId));
    }

    // Add weekday filter if provided
    if (weekdays.length > 0) {
      conditions.push(inArray(runs.weekday, weekdays));
    }

    // Add difficulty filter if provided
    if (difficulty) {
      conditions.push(eq(runs.difficulty, difficulty));
    }

    // Get all runs with the specified conditions
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
      .where(
        and(
          eq(runs.isApproved, true),

            gt(runs.datetime, now),
        )

      )
      .orderBy(asc(runs.datetime));




    // Transform the data to include a location object
    const transformedRuns = runsData.map((run: any) => ({
      ...run,
      location: {
        lat: run.locationLat,
        lng: run.locationLng,
      },
    }));

    return NextResponse.json(transformedRuns);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the date field
    if (!body.datetime) {
      return handleErrorResponse(
        new Error("Date is required"),
        "Date is required",
        400,
      );
    }

    // Ensure date is a valid Date object
    const datetime = new Date(body.datetime);
    if (isNaN(datetime.getTime())) {
      return handleErrorResponse(
        new Error("Invalid date"),
        "Invalid date",
        400,
      );
    }

    // Validate location coordinates
    if (!body.location?.lat || !body.location?.lng) {
      return handleErrorResponse(
        new Error("Location coordinates are required"),
        "Location coordinates are required",
        400,
      );
    }

    // Calculate weekday (1-7, where 1 is Monday)
    const weekday = ((datetime.getDay() + 6) % 7) + 1;

    // Create the run with flattened location fields
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
