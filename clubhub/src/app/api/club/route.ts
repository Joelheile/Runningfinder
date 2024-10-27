// clubhub/src/app/api/clubs.ts
import { db } from "@/db/db";
import { club } from "@/db/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db.select().from(club);
    console.log("api response:", res);

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
    avatarUrl,
  } = await request.json();
 
  try {
    console.log("Club request body:", request.body);
    const res = await db
      .insert(club)
      .values({
        id: uuidv4(),
        name,
        description,
        locationLng: location.lng,
        locationLat: location.lat,
        avatarUrl,
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
