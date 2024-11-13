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

    // Initialize conditions array
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

    // Validate difficulty
    const validDifficulties = ["easy", "intermediate", "advanced"];
    if (difficulty && validDifficulties.includes(difficulty)) {
      conditions.push(eq(runs.difficulty, difficulty));
    }

    // Apply conditions
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
  console.log("runData", runData);

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
