import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const approvedRun = await db
      .update(runs)
      .set({
        isApproved: true,
      })
      .where(eq(runs.id, id))
      .returning({
        id: runs.id,
        name: runs.name,
        clubId: runs.clubId,
        datetime: runs.datetime,
        weekday: runs.weekday,
        startDescription: runs.startDescription,
        locationLng: runs.locationLng,
        locationLat: runs.locationLat,
        distance: runs.distance,
        difficulty: runs.difficulty,
        isApproved: runs.isApproved,
        isRecurrent: runs.isRecurrent,
      });

    if (approvedRun.length === 0) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(approvedRun[0]);
  } catch (error) {
    console.error("Error approving run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
