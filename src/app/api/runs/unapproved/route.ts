import { db } from "@/lib/db/db";
import { clubs, runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const unapprovedRuns = await db
      .select({
        id: runs.id,
        name: runs.name,
        difficulty: runs.difficulty,
        clubId: runs.clubId,
        club: {
          id: clubs.id,
          name: clubs.name,
          description: clubs.description,
          instagramUsername: clubs.instagramUsername,
          stravaUsername: clubs.stravaUsername,
          avatarUrl: clubs.avatarUrl,
        },
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
      .leftJoin(clubs, eq(runs.clubId, clubs.id))
      .where(eq(runs.isApproved, false));

    return NextResponse.json(unapprovedRuns);
  } catch (error) {
    console.error("Error fetching unapproved runs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
