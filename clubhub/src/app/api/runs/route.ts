import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { and, between, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";


function parseQueryParams(searchParams: URLSearchParams) {
  const minDistance = parseInt(searchParams.get("minDistance") || "0", 42);
  const maxDistance = parseInt(searchParams.get("maxDistance") || "0", 42);
  const intervalDays =
    searchParams.get("interval_day")?.split(",").map(Number) || [];
  return { minDistance, maxDistance, intervalDays };
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
  const { minDistance, maxDistance, intervalDays } =
    parseQueryParams(searchParams);

  try {
    const query = db.select({
      id: runs.id,
      clubId: runs.clubId,
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
    }).from(runs);

    if (minDistance > 0 || maxDistance > 0) {
      query.where(
        between(runs.distance, minDistance.toString(), maxDistance.toString()),
      );
    }

    if (intervalDays.length > 0) {
      query.where(inArray(runs.intervalDay, intervalDays));
    }


    query.where(eq(runs.membersOnly,false ));

    const result = await query.execute();
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
      { status: 201 }
    );
  } catch (error) {
    return handleErrorResponse(error, "Error creating run");
  }
}
