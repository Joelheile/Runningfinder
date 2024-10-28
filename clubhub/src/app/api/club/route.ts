// clubhub/src/app/api/club.ts
import { db } from "@/db/db";
import { club } from "@/db/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db.select().from(club);
    // console.log("api response:", res);

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
  const { name, location, description, instagramUsername, websiteUrl, avatar } =
    await request.json();

  try {
    if (!avatar) {
      throw new Error("Avatar is required");
    }

    const fileBuffer = Buffer.from(avatar, "base64");
    console.log("File Buffer:", fileBuffer);

    const res = await db
      .insert(club)
      .values({
        id: uuidv4(),
        name,
        description,
        locationLng: location.lng,
        locationLat: location.lat,
        avatar: fileBuffer,
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
