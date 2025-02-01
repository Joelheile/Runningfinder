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
 * /api/upload/presignedurl:
 *   get:
 *     summary: Generate a presigned URL for uploading files to AWS S3.
 *     tags:
 *       - upload
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a presigned URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signedUrl:
 *                   type: string
 *       500:
 *         description: Internal Server Error.
 */
