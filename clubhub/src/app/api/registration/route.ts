import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema/runs";


import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db.select().from(registrations);

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
  const { user_id, run_id, status } = await request.json();

  try {
    const res = await db
      .insert(registrations)
      .values({
        id: uuidv4(),
        runId: run_id,
        userId: user_id,
        status: "active",
        registrationDate: new Date(),
      })
      .execute();
    console.log("memberships", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating membership:", error);
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
