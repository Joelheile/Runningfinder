import { db } from "@/lib/db/db";
import { clubs as club } from "@/lib/db/schema";
import { avatars} from "@/lib/db/schema/users";


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
        locationLng: club.locationLng,
        locationLat: club.locationLat,
        avatarFileId: club.avatarFileId,
        creationDate: club.creationDate,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        memberCount: club.memberCount,
        slug: club.slug,
        avatarUrl: avatars.img_url,
      })
      .from(club)
      .leftJoin(avatars, eq(club.avatarFileId, avatars.id));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
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
        slug: name.toLowerCase().replace(/ /g, "-"),
      })
      .execute();
    console.log("clubs", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
