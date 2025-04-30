import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const runId = searchParams.get("runId");

    if (!userId || !runId) {
      return NextResponse.json(
        { error: "Missing userId or runId" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.userId, userId),
          eq(registrations.runId, runId)
        )
      );

    const isRegistered = result.length > 0;

    return NextResponse.json({ isRegistered });
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json(
      { error: "Failed to check registration" },
      { status: 500 }
    );
  }
} 