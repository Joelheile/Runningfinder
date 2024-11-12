import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema/runs";

import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET({ request }: { request: Request }) {
  const { userId, runId } = await request.json();

  try {
    const res = await db
      .select()
      .from(registrations)
      .where(
        and(eq(registrations.userId, userId), eq(registrations.runId, runId)),
      )
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId, runId, status } = await request.json();
  console.log("api run", userId, runId);
  try {
    const res = await db
      .insert(registrations)
      .values({
        id: uuidv4(),
        runId: runId,
        userId: userId,
        status: status,
      })
      .execute();
    console.log("registration", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const { id, status } = await request.json();

  try {
    const res = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, id))
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
