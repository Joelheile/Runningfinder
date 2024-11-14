

import { db } from "../../../lib/db/db";
import { clubs as club } from "../../../lib/db/schema/clubs";
import { avatars } from "../../../lib/db/schema/users";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        description: club.description,
        locationLng: club.locationLng,
        locationLat: club.locationLat,
        avatarFileId: club.avatarFileId,
        creationDate: club.creationDate,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        memberCount: club.memberCount,
        slug: club.slug,
        avatarUrl: avatars.img_url,
      })
      .from(club)
      .leftJoin(avatars, eq(club.avatarFileId, avatars.id));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const {
    id,
    name,
    location,
    description,
    instagramUsername,
    websiteUrl,
    avatarFileId,
  } = await request.json();

  try {
    const res = await db
      .insert(club)
      .values({
        id,
        name,
        description,
        locationLng: location.lng,
        locationLat: location.lat,
        avatarFileId: avatarFileId,
        creationDate: new Date(),
        instagramUsername,
        websiteUrl,
        memberCount: 0,
        slug: name.toLowerCase().replace(/ /g, "-"),
      })
      .execute();
    console.log("clubs", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
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