import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema/runs";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
console.log("params", params);
  try {
    const res = await db
      .select()
      .from(registrations)
      .where(
        eq(registrations.userId, params.slug)
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
