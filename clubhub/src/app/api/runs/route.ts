import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { and, between, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Helper function to parse query parameters
function parseQueryParams(searchParams: URLSearchParams) {
  const minDistance = parseInt(searchParams.get('minDistance') || '0', 42);
  const maxDistance = parseInt(searchParams.get('maxDistance') || '0', 42);
  const intervalDays = searchParams.get('interval_day')?.split(',').map(Number) || [];
  return { minDistance, maxDistance, intervalDays };
}

// Helper function to handle errors
function handleErrorResponse(error: unknown, message = "Internal Server Error", status = 500) {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { minDistance, maxDistance, intervalDays } = parseQueryParams(searchParams);

  try {
    const query = db.select().from(runs);

    if (minDistance > 0 || maxDistance > 0) {
      query.where(between(runs.distance, minDistance.toString(), maxDistance.toString()));
    }

    if (intervalDays.length > 0) {
      query.where(inArray(runs.intervalDay, intervalDays));
    }

    const result = await query.execute();
    return NextResponse.json(result);
  } catch (error) {
    return handleErrorResponse(error, "Error fetching runs");
  }
}

export async function POST(request: Request) {
  const runData = await request.json();




  try {
    const newRun = {
      id: uuidv4(),
      ...runData,
      locationLng: runData.location.lng,
      locationLat: runData.location.lat,
    };

    await db.insert(runs).values(newRun).execute();

    return NextResponse.json({ message: "Run created successfully", run: newRun }, { status: 201 });
  } catch (error) {
    return handleErrorResponse(error, "Error creating run");
  }
}