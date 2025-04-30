// Presigned URLs allow you to upload large chunks of data directly at the source (here, Amazon S3).
import { s3Client } from "@/lib/db/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("fileName");
  const contentType = searchParams.get("contentType");

  if (!fileName || !contentType) {
    return new Response(null, { status: 500 });
  }

  const fileKey = `${Date.now().toString()}-${fileName}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(uploadParams);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  if (signedUrl) return NextResponse.json({ signedUrl }, { status: 200 });
  return NextResponse.json(null, { status: 500 });
}

/**
 * @swagger
 * /api/upload/presignedUrl:
 *   get:
 *     tags:
 *       - upload
 *     summary: Generate a presigned URL for S3 uploads.
 *     description: Creates a temporary signed URL for direct browser-to-S3 file uploads, bypassing the server.
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Original filename of the file to upload
 *       - in: query
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *         description: MIME type of the file (e.g., image/jpeg, image/png)
 *     responses:
 *       200:
 *         description: Successfully generated presigned URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signedUrl:
 *                   type: string
 *                   description: Temporary URL to upload the file directly to S3
 *                   example: https://bucket-name.s3.region.amazonaws.com/1623456789-file.jpg?X-Amz-Algorithm=...
 *       400:
 *         description: Missing required parameters.
 *       401:
 *         description: Unauthorized - Authentication required.
 *       500:
 *         description: Failed to generate presigned URL.
 */
