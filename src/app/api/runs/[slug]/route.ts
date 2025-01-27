import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const [result] = await db.select().from(runs).where(eq(runs.id, slug)).limit(1);

    if (!result) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching run by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    
    // First check if the run exists
    const [existingRun] = await db.select().from(runs).where(eq(runs.id, slug)).limit(1);

    if (!existingRun) {
      return NextResponse.json(
        { error: "Run not found" },
        { status: 404 }
      );
    }

    // Create an update object with only the fields that are present
    const updateData: Partial<typeof runs.$inferSelect> = {};
    
    if (body.name !== undefined) updateData.name = body.name;

    if (body.datetime !== undefined) updateData.datetime = new Date(body.date);
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.distance !== undefined) updateData.distance = body.distance;
    if (body.startDescription !== undefined) updateData.startDescription = body.startDescription;
    if (body.isApproved !== undefined) updateData.isApproved = body.isApproved;
    if (body.isRecurrent !== undefined) updateData.isRecurrent = body.isRecurrent;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingRun);
    }

    const [updatedRun] = await db
      .update(runs)
      .set(updateData)
      .where(eq(runs.id, slug))
      .returning();

    return NextResponse.json(updatedRun);
  } catch (error) {
    console.error("Error updating run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedRuns = await db
      .delete(runs)
      .where(eq(runs.id, slug))
      .returning({
        id: runs.id,
        name: runs.name,
        isApproved: runs.isApproved
      });

    if (!deletedRuns.length) {
      return NextResponse.json(
        { error: "Run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedRuns[0]);
  } catch (error) {
    console.error("Error deleting run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
