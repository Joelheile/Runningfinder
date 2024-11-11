// clubhub/src/app/api/runs/route.ts
import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { and, between, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minDistance = parseInt(searchParams.get('minDistance') || '0', 42);
  const maxDistance = parseInt(searchParams.get('maxDistance') || '0',42);
  const intervalDays = searchParams.get('interval_day')?.split(',').map(Number) || [];

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
    console.error("Error fetching runs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const runData = await request.json();
  const requiredFields = ['clubId', 'date', 'interval', 'intervalDay', 'startTime', 'location', 'distance'];

  if (!requiredFields.every(field => runData[field])) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

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
    console.error("Error creating run:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}