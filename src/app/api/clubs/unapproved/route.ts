import { db } from "@/lib/db/db";
import { clubs as club } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const DEFAULT_FALLBACK_IMAGE_URL = "/assets/default-fallback-image.png";

export async function GET() {
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        description: club.description,
        avatarUrl: club.avatarUrl,
        creationDate: club.creationDate,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        slug: club.slug,
      })
      .from(club)
      .where(eq(club.isApproved, false)).orderBy(club.creationDate)

    const clubsWithFallbackAvatar = res.map((club: { avatarUrl: any }) => ({
      ...club,
      avatarUrl: club.avatarUrl || DEFAULT_FALLBACK_IMAGE_URL,
    }));

    return NextResponse.json(clubsWithFallbackAvatar);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}