import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const runId = searchParams.get("runId");

  if (!userId || !runId) {
    return NextResponse.json(
      { error: "User ID and Run ID are required" },
      { status: 400 },
    );
  }

  try {
    const result = await db
      .select()
      .from(registrations)
      .where(
        and(eq(registrations.userId, userId), eq(registrations.runId, runId)),
      )
      .execute();

    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
      Vary: "*",
    };

    return NextResponse.json({ isRegistered: result.length > 0 }, { headers });
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
