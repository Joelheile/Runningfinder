import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const approvedRun = await db
      .update(runs)
      .set({
        isApproved: true,
      })
      .where(eq(runs.id, slug))
      .returning({
        id: runs.id,
        name: runs.name,

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
      });

    if (!approvedRun.length) {
      return NextResponse.json(
        { error: "Run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(approvedRun[0]);
  } catch (error) {
    console.error("Error approving run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
