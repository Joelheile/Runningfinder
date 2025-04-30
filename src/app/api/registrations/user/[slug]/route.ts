import { db } from "@/lib/db/db";
import { registrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 
export const fetchCache = 'force-no-store';
export const revalidate = 0; 

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  if (!params.slug) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }
  
  try {
    const query = db
      .select()
      .from(registrations)
      .where(eq(registrations.userId, params.slug));

    const res = await query.execute();

    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'Vary': '*',
    };

    return NextResponse.json(res, { 
      headers,
      status: 200 
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/registrations/user/{slug}:
 *   get:
 *     tags:
 *       - registrations
 *     summary: Retrieve registrations for a specific user.
 *     description: Returns all run registrations for a given user ID.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch registrations for
 *     responses:
 *       200:
 *         description: List of user's run registrations.
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
 *                   runId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [registered, attended, cancelled]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Authentication required.
 *       403:
 *         description: Forbidden - User can only access their own registrations.
 *       500:
 *         description: Internal Server Error.
 */
