import { db } from "@/lib/db/db";
import { avatarStorage, club, run } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db
      .select()
      .from(run)

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const {
    clubId,
    date,
    interval,
    intervalDay,
    startDescription,
    startTime,
    location,
    distance,
    // temperature,
    // wind,
    // uv_index
  } = await request.json();

  try {
    const res = await db
      .insert(run)
      .values({
        id: uuidv4(),
        clubId,
        date,
        interval,
        intervalDay,
        startDescription,
        startTime,
        distance,
        locationLng: location.lng,
        locationLat: location.lat,

      })
      .execute();
    console.log("clubs", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
