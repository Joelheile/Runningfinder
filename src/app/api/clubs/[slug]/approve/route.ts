import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    // First check if the club exists and get its current status
    const existingClub = await db
      .select()
      .from(clubs)
      .where(eq(clubs.slug, params.slug));

    if (!existingClub.length) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    console.log('Existing club before update:', {
      slug: existingClub[0].slug,
      isApproved: existingClub[0].isApproved
    });

    // Update the club using Drizzle's query builder
    const updatedClub = await db
      .update(clubs)
      .set({ isApproved: true })
      .where(eq(clubs.slug, params.slug))
      .returning();

    if (!updatedClub.length) {
      throw new Error('Club update failed - no rows returned');
    }

    console.log('Update result:', updatedClub[0]);

    if (!updatedClub[0].isApproved) {
      throw new Error('Club update failed - isApproved is not true');
    }

    console.log('Update successful:', {
      slug: updatedClub[0].slug,
      isApproved: updatedClub[0].isApproved
    });

    return NextResponse.json(updatedClub[0]);
  } catch (error) {
    console.error("Error approving club:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
