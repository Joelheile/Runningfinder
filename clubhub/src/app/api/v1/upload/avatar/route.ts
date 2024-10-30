import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

import { v4 } from "uuid";
import { db } from "@/db/db";
import { avatarStorage } from "@/db/schema";

export async function POST(request: Request) {
  //TODO: Refactor AvatarUploader to this route
  const { objectName, objectUrl, objectId } = await request.json();

  try {
    const res = await db
      .insert(avatarStorage)
      .values({
        id: objectId,
        name: objectName,
        img_url: objectUrl,
        uploadDate: new Date(),
      })
      .execute();

    return NextResponse.json(
      { message: "Successfully uploaded the file" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading file: ", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
