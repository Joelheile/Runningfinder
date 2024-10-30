import { db } from "@/lib/db/db";
import { avatarStorage, club } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        description: club.description,
        locationLat: club.locationLat,
        locationLng: club.locationLng,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        avatarUrl: avatarStorage.img_url,
      })
      .from(club)
      .leftJoin(avatarStorage, eq(club.avatarFileId, avatarStorage.id));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const {
    name,
    location,
    description,
    instagramUsername,
    websiteUrl,
    avatarFileId,
  } = await request.json();

  try {
    const res = await db
      .insert(club)
      .values({
        id: uuidv4(),
        name,
        description,
        locationLng: location.lng,
        locationLat: location.lat,
        avatarFileId: avatarFileId,
        creationDate: new Date(),
        instagramUsername,
        websiteUrl,
        memberCount: 0,
      })
      .execute();

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
