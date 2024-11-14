import { db } from "@/lib/db/db";
import { memberships } from "@/lib/db/schema/clubs";

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const res = await db.select().from(memberships);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { user_id, club_id, status } = await request.json();

  try {
    const res = await db
      .insert(memberships)
      .values({
        id: uuidv4(),
        userId: user_id,
        clubId: club_id,
        joinDate: new Date(),
        status: status,
      })
      .execute();
    console.log("memberships", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating membership:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
/**
 * @swagger
 * /api/memberships:
 *   get:
 *     summary: Retrieve all memberships.
 *     tags:
 *       - memberships
 *     responses:
 *       200:
 *         description: A list of memberships.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal Server Error.
 *
 *   post:
 *     summary: Create a new membership.
 *     tags:
 *       - memberships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               club_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership created successfully.
 *       500:
 *         description: Internal Server Error.
 */
