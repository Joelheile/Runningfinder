import { db } from "@/lib/db/db";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const DEFAULT_FALLBACK_IMAGE_URL = "/assets/default-fallback-image.png";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const res = await db
      .select()
      .from(clubs)
      .where(eq(clubs.slug, params.slug));

    if (res.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const clubData = res[0];
    clubData.avatarUrl = clubData.avatarUrl || DEFAULT_FALLBACK_IMAGE_URL;

    return NextResponse.json(clubData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "Club slug is required" }, { status: 400 });
    }

    const body = await request.json();
    
    // Create an update object with only the fields that are present
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.locationLat !== undefined) updateData.locationLat = body.locationLat;
    if (body.locationLng !== undefined) updateData.locationLng = body.locationLng;
    if (body.instagramUsername !== undefined) updateData.instagramUsername = body.instagramUsername;
    if (body.stravaUsername !== undefined) updateData.stravaUsername = body.stravaUsername;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;

    const updatedClub = await db
      .update(clubs)
      .set(updateData)
      .where(eq(clubs.slug, slug))
      .returning();

    if (!updatedClub.length) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClub[0]);
  } catch (error) {
    console.error("Error updating club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "Club slug is required" }, { status: 400 });
    }

    const deletedClub = await db
      .delete(clubs)
      .where(eq(clubs.slug, slug))
      .returning();

    if (!deletedClub.length) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedClub[0]);
  } catch (error) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
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
 *   patch:
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
 *               instagramUsername:
 *                 type: string
 *               stravaUsername:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Club updated successfully.
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     tags:
 *       - clubs
 *     summary: Delete a club by slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Club deleted successfully.
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Internal Server Error.
 */
