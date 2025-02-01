import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { Club } from "@/lib/types/Club";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // First, log all clubs to see their approval status
    const allClubs = await db
      .select()
      .from(clubs)
      .execute();


    // Then get unapproved clubs with explicit false check
    const unapprovedClubs = await db
      .select()
      .from(clubs)
      .where(eq(clubs.isApproved, false))
      .orderBy(clubs.creationDate)
      .execute();



    // Ensure all required fields are present with default values if needed
    const clubsWithDefaults = unapprovedClubs.map((club: Club) => {
      const clubWithDefaults = {
        ...club,
        slug: club.slug || club.name.toLowerCase().replace(/\s+/g, "-"),
        creationDate: club.creationDate || new Date().toISOString(),
        avatarUrl: club.avatarUrl || "/assets/default-fallback-image.png",
      };

      return clubWithDefaults;
    });

    return NextResponse.json(clubsWithDefaults, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching unapproved clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
