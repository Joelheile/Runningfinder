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
          gt(runs.date, now)
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

    // First get all runs to see what's in the database
    const allRuns = await db.select().from(runs);
    console.log('All runs in database:', allRuns);

    const runsData = conditions.length > 0 
      ? await db.select().from(runs).where(and(...conditions)).orderBy(asc(runs.date))
      : allRuns;
    
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
    let dateValue: Date;
    try {
      dateValue = new Date(body.date);
      if (isNaN(dateValue.getTime())) {
        throw new Error("Invalid date value");
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      return handleErrorResponse(error, "Invalid date format", 400);
    }

    // Transform the location object into separate fields
    const { location, ...restBody } = body;
    const result = await db.insert(runs).values({
      ...restBody,
      date: dateValue,
      locationLat: location?.lat,
      locationLng: location?.lng
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error details:", error);
    return handleErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const result = await db.delete(runs).where(eq(runs.id, body.id));
    return NextResponse.json(result);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
