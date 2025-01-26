import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { and, asc, eq, gt, inArray } from "drizzle-orm";
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

    // Get current date
    const now = new Date();

    // Build query conditions
    const conditions = [
      eq(runs.isApproved, true),
      and(
        eq(runs.isRecurrent, false),
        gt(runs.date, now)
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

    // Execute optimized query with all conditions
    const result = await db
      .select({
        id: runs.id,
        name: runs.name,
        date: runs.date,
        weekday: runs.weekday,
        difficulty: runs.difficulty,
        distance: runs.distance,
        startDescription: runs.startDescription,
        location: {
          lat: runs.locationLat,
          lng: runs.locationLng,
        },
        clubId: runs.clubId,
        isRecurrent: runs.isRecurrent,
        isApproved: runs.isApproved,
      })
      .from(runs)
      .where(and(...conditions))
      .orderBy(asc(runs.date)) // Order by date ascending
      .execute();

    return NextResponse.json(result);
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

    const result = await db.insert(runs).values({
      ...body,
      date: dateValue
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
