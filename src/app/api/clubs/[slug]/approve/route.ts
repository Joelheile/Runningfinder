import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const updatedClub = await db
      .update(clubs)
      .set({ isApproved: true })
      .where(eq(clubs.slug, params.slug))
      .returning();

    if (!updatedClub.length) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClub[0]);
  } catch (error) {
    console.error("Error approving club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
