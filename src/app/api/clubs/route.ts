import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db/db";
import { clubs as club } from "../../../lib/db/schema";

const DEFAULT_FALLBACK_IMAGE_URL = "/assets/default-fallback-image.png";

export async function GET() {
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        description: club.description,
        avatarUrl: club.avatarUrl,
        creationDate: club.creationDate,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        slug: club.slug,
      })
      .from(club);

    const clubsWithFallbackAvatar = res.map((club: { avatarUrl: any; }) => ({
      ...club,
      avatarUrl: club.avatarUrl || DEFAULT_FALLBACK_IMAGE_URL,
    }));

    return NextResponse.json(clubsWithFallbackAvatar);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      id,
      name,
      description,
      instagramUsername,
      stravaUsername,
      avatarFileId,
      avatarUrl
    } = await request.json();

    // Validate required fields
    if (!id || !name) {
      return NextResponse.json(
        { error: "Missing required fields: id and name are required" },
        { status: 400 }
      );
    }

    const res = await db
      .insert(club)
      .values({
        id,
        name,
        description,
        avatarUrl: avatarUrl || DEFAULT_FALLBACK_IMAGE_URL,
        avatarFileId,
        creationDate: new Date(),
        instagramUsername: instagramUsername || null,
        stravaUsername: stravaUsername || null,
        slug: name.toLowerCase().replace(/ /g, "-"),
        isApproved: false
      })
      .returning(); // Return the inserted record

    if (!res || res.length === 0) {
      console.error("Club creation failed: No record returned");
      return NextResponse.json(
        { error: "Failed to create club" },
        { status: 500 }
      );
    }

    return NextResponse.json(res[0]);
  } catch (error: any) {
    console.error("Error creating club:", error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      return NextResponse.json(
        { error: "A club with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create club", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const res = await db.delete(club).where(eq(club.id, id)).execute();

    return NextResponse.json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: Retrieve a list of clubs.
 *     tags:
 *       - clubs
 *     responses:
 *       200:
 *         description: A list of clubs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   locationLng:
 *                     type: number
 *                   locationLat:
 *                     type: number
 *                   avatarFileId:
 *                     type: string
 *                   creationDate:
 *                     type: string
 *                     format: date-time
 *                   instagramUsername:
 *                     type: string
 *                   websiteUrl:
 *                     type: string
 *                   memberCount:
 *                     type: integer
 *                   slug:
 *                     type: string
 *                   avatarUrl:
 *                     type: string
 *       500:
 *         description: Internal Server Error

 *   post:
 *     summary: Create a new club.
 *     tags:
 *       - clubs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lng:
 *                     type: number
 *                   lat:
 *                     type: number
 *               description:
 *                 type: string
 *               instagramUsername:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               avatarFileId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Club created successfully.
 *       500:
 *         description: Internal Server Error

 *   delete:
 *     summary: Delete a club.
 *     tags:
 *       - clubs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Club deleted successfully.
 *       500:
 *         description: Internal Server Error
 */
