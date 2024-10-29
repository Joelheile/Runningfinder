import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { fileStorage } from "@/db/schema";
import { v4 } from "uuid";
import { db } from "@/db/db";

export async function POST(request: Request) {
  const { objectName, objectUrl } = await request.json();

  try {
    const res = await db
      .insert(fileStorage)
      .values({
        id: v4(),
        name: objectName,
        img_url: objectUrl,
      })
      .execute();

    return NextResponse.json(
      { message: "Successfully uploaded the file" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file: ", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
