import { NextResponse } from "next/server";

import { db } from "@/lib/db/db";
import { avatars } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { objectName, objectUrl, objectId } = await request.json();

  try {
    const res = await db
      .insert(avatars)
      .values({
        id: objectId,
        type: "user",
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
 * /api/upload/avatar/user:
 *   post:
 *     tags:
 *       - upload
 *     summary: Upload a user avatar.
 *     description: Stores user avatar information in the database after it has been uploaded to S3.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - objectName
 *               - objectUrl
 *               - objectId
 *             properties:
 *               objectName:
 *                 type: string
 *                 description: Original filename of the avatar
 *               objectUrl:
 *                 type: string
 *                 description: Full URL to the avatar in S3
 *               objectId:
 *                 type: string
 *                 description: Unique identifier for the avatar
 *     responses:
 *       200:
 *         description: Avatar information successfully stored.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully uploaded the file
 *       401:
 *         description: Unauthorized - Authentication required.
 *       500:
 *         description: Failed to store avatar information.
 *
 *   delete:
 *     tags:
 *       - upload
 *     summary: Delete a user avatar.
 *     description: Removes avatar information from the database (doesn't delete from S3).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - objectId
 *             properties:
 *               objectId:
 *                 type: string
 *                 description: Unique identifier of the avatar to delete
 *     responses:
 *       200:
 *         description: Avatar information successfully removed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully deleted the file
 *       401:
 *         description: Unauthorized - Authentication required.
 *       404:
 *         description: Avatar not found.
 *       500:
 *         description: Failed to delete avatar information.
 */
