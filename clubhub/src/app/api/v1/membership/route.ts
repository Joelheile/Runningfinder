import { db } from "@/lib/db/db";
import { avatarStorage, membership, run } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db
      .select()
      .from(membership)

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const {
   user_id,
    club_id,
    status
  } = await request.json();

  try {
    const res = await db
      .insert(membership)
      .values({
        id: uuidv4(),
        userId: user_id,
        clubId: club_id,
        joinDate: new Date(),
        status: status,

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
