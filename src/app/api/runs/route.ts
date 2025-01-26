import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { and, between, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

function parseQueryParams(searchParams: URLSearchParams) {
  return {
    minDistance: parseInt(searchParams.get("minDistance") || "", 10) || null,
    maxDistance: parseInt(searchParams.get("maxDistance") || "", 10) || null,
    intervalDays: searchParams.get("interval_day")?.split(",").map(Number) || [],
    difficulty: searchParams.get("difficulty") || null,
  };
}

function handleErrorResponse(error: unknown, message = "Internal Server Error", status = 500) {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { minDistance, maxDistance, intervalDays, difficulty } = parseQueryParams(searchParams);

  try {
    const conditions = [eq(runs.membersOnly, false)];

    if (minDistance !== null && maxDistance !== null && minDistance >= 0 && maxDistance >= minDistance) {
      conditions.push(between(runs.distance, minDistance.toString(), maxDistance.toString()));
    } else if (minDistance !== null && minDistance >= 0) {
      conditions.push(eq(runs.distance, minDistance.toString()));
    }

    const validDays = intervalDays.filter(day => Number.isInteger(day) && day >= 1 && day <= 7);
    if (validDays.length > 0) {
      conditions.push(inArray(runs.weekday, validDays));
    }

    const validDifficulties = ["easy", "intermediate", "advanced"];
    if (difficulty && validDifficulties.includes(difficulty)) {
      conditions.push(eq(runs.difficulty, difficulty));
    }

    const baseQuery = db.select({
      id: runs.id,
      name: runs.name,
      clubId: runs.clubId,
      difficulty: runs.difficulty,
      date: runs.date,
      weekday: runs.weekday,
      startDescription: runs.startDescription,
      mapsLink: runs.mapsLink,
      distance: runs.distance,
      location: { lat: runs.locationLat, lng: runs.locationLng },
    }).from(runs).where(and(...conditions));

    const result = await baseQuery.execute();
    return NextResponse.json(result);
  } catch (error) {
    return handleErrorResponse(error, "Error fetching runs");
  }
}

export async function POST(request: Request) {
  const runData = await request.json();
  
  // Extract location data and ensure date is a proper Date object
  const newRun = {
    ...runData,
    locationLng: runData.location.lng,
    locationLat: runData.location.lat,
    date: runData.date ? new Date(runData.date) : null
  };

  try {
    await db.insert(runs).values(newRun).execute();
    return NextResponse.json({ message: "Run created successfully", run: newRun }, { status: 201 });
  } catch (error) {
    console.error("Error details:", error);
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
