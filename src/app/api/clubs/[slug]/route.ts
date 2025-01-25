import { db } from "@/lib/db/db";
import { avatars, clubs as club } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const res = await db
      .select({
        id: club.id,
        name: club.name,
        slug: club.slug,
        description: club.description,
        locationLng: club.locationLng,
        locationLat: club.locationLat,
        instagramUsername: club.instagramUsername,
        websiteUrl: club.websiteUrl,
        avatarUrl: avatars.img_url,
      })
      .from(club)
      .leftJoin(avatars, eq(club.avatarFileId, avatars.id))
      .where(eq(club.slug, params.slug));

    if (res.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(res[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { name, description, locationLat, locationLng } = await request.json();

  try {
    const updatedClub = await db
      .update(club)
      .set({
        name,
        description,
        locationLat,
        locationLng,
      })
      .where(eq(club.slug, params.slug));

    return NextResponse.json(updatedClub);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/clubs/{slug}:
 *   get:
 *     tags:
 *       - clubs
 *     summary: Retrieve a club by slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the club data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 description:
 *                   type: string
 *                 locationLng:
 *                   type: number
 *                 locationLat:
 *                   type: number
 *                 instagramUsername:
 *                   type: string
 *                 websiteUrl:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Internal Server Error.
 *
 *   put:
 *     tags:
 *       - clubs
 *     summary: Update a club by slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               locationLat:
 *                 type: number
 *               locationLng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Club updated successfully.
 *       500:
 *         description: Internal Server Error.
 */
