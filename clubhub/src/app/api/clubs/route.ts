// clubhub/src/app/api/clubs.ts
import { db } from "@/db/db";
import { club } from "@/db/schema";
import { NextResponse } from "next/server";

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