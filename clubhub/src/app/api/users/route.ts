import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET({ userId }: { userId: string }) {
  try {
    const res = await db.select().from(users).where(eq(users.id, userId));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 *  @swagger
 * /api/users/:
 *   get:
 *     summary: Retrieve a user by userId.
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the user data.
 *         content:
 *           application/json:
 *       500:
 *         description: Internal Server Error.
 */
