// clubhub/src/app/api/clubs.ts
import { db } from "@/db/db";
import { club } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await db.select().from(club);
    const plainRes = res.map((club) => ({
      id: club.id,
      name: club.name,
      positionLang: club.positionLang,
      positionLat: club.positionLat,
      description: club.description,
      creationDate: club.creationDate,
    }));
    return NextResponse.json(plainRes);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
