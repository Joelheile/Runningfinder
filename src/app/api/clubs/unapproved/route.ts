import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const unapprovedClubs = await db
      .select()
      .from(clubs)
      .where(eq(clubs.isApproved, false))
      .execute();

    return NextResponse.json(unapprovedClubs);
  } catch (error) {
    console.error("Error fetching unapproved clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
