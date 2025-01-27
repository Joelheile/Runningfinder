import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { Club } from "@/lib/types/Club";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const unapprovedClubs = await db
      .select()
      .from(clubs)
      .where(eq(clubs.isApproved, false))
      .orderBy(clubs.creationDate)  // Order by creation date to maintain consistent order
      .execute();

    // Ensure all required fields are present with default values if needed
    const clubsWithDefaults = unapprovedClubs.map((club: Club) => {
      const clubWithDefaults = {
        ...club,
        slug: club.slug || club.name.toLowerCase().replace(/\s+/g, '-'),
        creationDate: club.creationDate || new Date().toISOString(),
        avatarUrl: club.avatarUrl || '/assets/default-club-avatar.png'
      };

      return clubWithDefaults;
    });

    return NextResponse.json(clubsWithDefaults, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error("Error fetching unapproved clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
