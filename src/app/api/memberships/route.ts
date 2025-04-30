import { db } from "@/lib/db/db";
import { memberships } from "@/lib/db/schema";

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
 *     tags:
 *       - memberships
 *     summary: Retrieve all memberships.
 *     description: Returns a list of all club memberships across the platform.
 *     responses:
 *       200:
 *         description: A list of all memberships.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   clubId:
 *                     type: string
 *                   joinDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [pending, active, rejected]
 *                   role:
 *                     type: string
 *                     enum: [member, admin, owner]
 *       401:
 *         description: Unauthorized - Authentication required.
 *       500:
 *         description: Internal Server Error.
 *
 *   post:
 *     tags:
 *       - memberships
 *     summary: Create a new membership.
 *     description: Creates a new club membership for a user, defaulting to pending status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - club_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID requesting membership
 *               club_id:
 *                 type: string
 *                 description: Club ID to join
 *               status:
 *                 type: string
 *                 enum: [pending, active, rejected]
 *                 default: pending
 *                 description: Initial status of the membership
 *     responses:
 *       200:
 *         description: Membership created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       409:
 *         description: Membership already exists.
 *       401:
 *         description: Unauthorized - Authentication required.
 *       500:
 *         description: Internal Server Error.
 */
