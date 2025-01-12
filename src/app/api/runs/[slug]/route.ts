import { db } from "@/lib/db/db";
import { runs } from "@/lib/db/schema/runs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "runId is required" }, { status: 400 });
  }
  try {
    const res = await db
      .select()
      .from(runs)
      .where(eq(runs.id, slug))
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching run by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
