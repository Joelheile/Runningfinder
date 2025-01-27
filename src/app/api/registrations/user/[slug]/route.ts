import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  console.log("params", params);
  try {
    const query = db
      .select()
      .from(registrations)
      .where(eq(registrations.userId, params.slug));

    console.log("Executing query:", query.toSQL());

    const res = await query.execute();

    console.log("Query result:", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
