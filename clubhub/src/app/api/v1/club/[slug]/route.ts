import { db } from "@/lib/db/db";
import { club, avatarStorage } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  console.log("Fetching club with slug:", params.slug);
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        slug: club.slug,
        description: club.description,
        locationLng: club.locationLng,
        locationLat: club.locationLat,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        avatarUrl: avatarStorage.img_url,
      })
      .from(club)
      .leftJoin(avatarStorage, eq(club.avatarFileId, avatarStorage.id))
      .where(eq(club.slug, params.slug));

    console.log("Fetched club test:", res);
    if (res.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(res[0]);
  } catch (error) {
    console.error("Error fetching club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}