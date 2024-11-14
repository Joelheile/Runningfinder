import { NextResponse } from "next/server";

import { db } from "@/lib/db/db";
import { avatars } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { objectName, objectUrl, objectId } = await request.json();

  try {
    const res = await db
      .insert(avatars)
      .values({
        id: objectId,
        type: "club",
        name: objectName,
        img_url: objectUrl,
        uploadDate: new Date(),
      })
      .execute();

    return NextResponse.json(
      { message: "Successfully uploaded the file" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading file: ", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { objectId } = await request.json();

  try {
    const res = await db
      .delete(avatars)
      .where(eq(avatars.id, objectId))
      .execute();

    return NextResponse.json(
      { message: "Successfully deleted the file" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting file: ", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/upload/avatar/club:
 *   post:
 *     summary: Uploads club avatar when adding a club.
 *     tags:
 *       - upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objectName:
 *                 type: string
 *               objectUrl:
 *                 type: string
 *               objectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully uploaded the file.
 *       500:
 *         description: Failed to upload file.
 *
 *   delete:
 *     summary: Delete the avatar.
 *     tags:
 *       - upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the file.
 *       500:
 *         description: Failed to delete file.
 */