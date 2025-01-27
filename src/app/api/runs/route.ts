import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { and, asc, eq, gt, inArray, or } from "drizzle-orm";
import { NextResponse } from "next/server";

const VALID_DIFFICULTIES = ["easy", "intermediate", "advanced"] as const;
type Difficulty = typeof VALID_DIFFICULTIES[number];

function parseQueryParams(searchParams: URLSearchParams) {
  const weekdays = searchParams.get("weekdays")?.split(",").map(Number) || [];
  const difficulty = searchParams.get("difficulty") as Difficulty | null;
  const clubId = searchParams.get("clubId");
  
  return {
    weekdays: weekdays.filter(day => Number.isInteger(day) && day >= 1 && day <= 7),
    difficulty: VALID_DIFFICULTIES.includes(difficulty as Difficulty) ? difficulty : null,
    clubId,
  };
}

function handleErrorResponse(error: unknown, message = "Internal Server Error", status = 500) {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { weekdays, difficulty, clubId } = parseQueryParams(searchParams);

    console.log('Query params:', { weekdays, difficulty, clubId });
    
    // Get current date
    const now = new Date();
    console.log('Current date:', now);

    const conditions = [
      eq(runs.isApproved, true),
      or(
        eq(runs.isRecurrent, true),
        and(
          eq(runs.isRecurrent, false),
          gt(runs.datetime, now)
        )
      )
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

    console.log('Query conditions:', conditions);

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
      .where(and(...conditions))
      .orderBy(asc(runs.datetime));
    
    console.log('Fetched runs from database:', runsData);

    // Transform the data to include a location object
    const transformedRuns = runsData.map((run: any) => ({
      ...run,
      location: {
        lat: run.locationLat,
        lng: run.locationLng
      }
    }));

    console.log('Transformed runs:', transformedRuns);
    
    return NextResponse.json(transformedRuns);
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the date field
    if (!body.date) {
      return handleErrorResponse(new Error("Date is required"), "Date is required", 400);
    }

    // Ensure date is a valid Date object
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      return handleErrorResponse(new Error("Invalid date"), "Invalid date", 400);
    }

    // Extract time in HH:mm format
    const time = date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Calculate weekday (1-7, where 1 is Monday)
    const weekday = ((date.getDay() + 6) % 7) + 1;

    // Create the run with both date and time
    const run = await db
      .insert(runs)
      .values({
        ...body,
        date,
        time,
        weekday,
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
      return handleErrorResponse(new Error("ID is required"), "ID is required", 400);
    }

    const deletedRun = await db
      .delete(runs)
      .where(eq(runs.id, id))
      .returning();

    if (!deletedRun.length) {
      return NextResponse.json(
        { error: "Run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedRun[0]);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
