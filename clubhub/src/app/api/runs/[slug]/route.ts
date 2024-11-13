import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  console.log("api slug", slug);
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  try {
    console.log("API: Fetching runs with club ID:", slug);
    const res = await db
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
      .from(runs).where(eq(runs.clubId, slug)).execute();
      console.log("API: Fetched runs with club ID:", res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching runs with clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
