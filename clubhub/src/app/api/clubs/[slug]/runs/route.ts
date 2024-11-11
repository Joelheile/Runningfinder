import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { clubs } from "@/lib/db/schema/clubs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(params: { params: { slug: string } }) {
  const clubId = params.params.slug;
  try {
    const res = await db
      .select()
      .from(runs)
      .leftJoin(clubs, eq(clubs.id, runs.clubId))
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching runs with clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
