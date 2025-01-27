import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    const res = await db
      .select()
      .from(runs)
      .where(eq(runs.id, slug));

    if (!res.length) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(res[0]);
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
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    console.log("Updating run with data:", body);
    
    // Create an update object with only the fields that are present
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) {
      const date = new Date(body.date);
      updateData.date = date;
      // Extract time in HH:mm format
      updateData.time = date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      // Set weekday (1-7, where 1 is Monday)
      updateData.weekday = ((date.getDay() + 6) % 7) + 1;
    }
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.distance !== undefined) updateData.distance = body.distance;
    if (body.startDescription !== undefined) updateData.startDescription = body.startDescription;
    if (body.isApproved !== undefined) updateData.isApproved = body.isApproved;
    if (body.isRecurrent !== undefined) updateData.isRecurrent = body.isRecurrent;
    if (body.locationLat !== undefined) updateData.locationLat = body.locationLat;
    if (body.locationLng !== undefined) updateData.locationLng = body.locationLng;
    if (body.mapsLink !== undefined) updateData.mapsLink = body.mapsLink;

    console.log("Final update data:", updateData);

    // Convert updateData to SET clause
    const setClauses = Object.entries(updateData)
      .map(([key, value]) => {
        if (value instanceof Date) {
          return `${key} = '${value.toISOString()}'`;
        }
        if (typeof value === 'string') {
          return `${key} = '${value}'`;
        }
        return `${key} = ${value}`;
      })
      .join(', ');

    const query = sql.raw(`
      UPDATE runs 
      SET ${setClauses}
      WHERE id = '${slug}'
      RETURNING *;
    `);

    const result = await db.execute(query);
    const updatedRun = result.rows[0];

    if (!updatedRun) {
      return NextResponse.json(
        { error: "Run not found" },
        { status: 404 }
      );
    }

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

    const query = sql.raw(`
      DELETE FROM runs 
      WHERE id = '${slug}'
      RETURNING *;
    `);

    const result = await db.execute(query);
    const deletedRun = result.rows[0];

    if (!deletedRun) {
      return NextResponse.json(
        { error: "Run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedRun);
  } catch (error) {
    console.error("Error deleting run:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
