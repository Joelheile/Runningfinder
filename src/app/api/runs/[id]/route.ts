import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const [result] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!result) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching run by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();

    // First check if the run exists
    const [existingRun] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!existingRun) {
      return NextResponse.json(
        { success: false, message: "Run not found" },
        { status: 200 },
      );
    }

    // Create an update object with only the fields that are present
    const updateData: Partial<typeof runs.$inferSelect> = {};

    // Only allow updating these specific fields during normal updates
    if (body.name !== undefined) updateData.name = body.name;
    if (body.datetime !== undefined)
      updateData.datetime = new Date(body.datetime);
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.distance !== undefined) updateData.distance = body.distance;
    if (body.startDescription !== undefined)
      updateData.startDescription = body.startDescription;
    if (body.isRecurrent !== undefined)
      updateData.isRecurrent = body.isRecurrent;
    if (body.locationLat !== undefined)
      updateData.locationLat = body.locationLat;
    if (body.locationLng !== undefined)
      updateData.locationLng = body.locationLng;
    if (body.mapsLink !== undefined) updateData.mapsLink = body.mapsLink;

    // Only allow setting isApproved if it's explicitly passed and true
    // This ensures isApproved can only be set through the approve endpoint
    if (body.isApproved === true) updateData.isApproved = true;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingRun);
    }

    const [updatedRun] = await db
      .update(runs)
      .set(updateData)
      .where(eq(runs.id, id))
      .returning();

    return NextResponse.json(updatedRun);
  } catch (error) {
    console.error("Error updating run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // First check if the run exists
    const [existingRun] = await db
      .select()
      .from(runs)
      .where(eq(runs.id, id))
      .limit(1);

    if (!existingRun) {
      // Return 200 if run doesn't exist, as the end state is what the client wanted
      return NextResponse.json({
        success: true,
        message: "Run already deleted",
      });
    }

    const [deletedRun] = await db
      .delete(runs)
      .where(eq(runs.id, id))
      .returning();

    return NextResponse.json(deletedRun);
  } catch (error) {
    console.error("Error deleting run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
