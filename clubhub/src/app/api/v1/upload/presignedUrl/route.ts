// /app/api/presigned/route.ts
// Presigned URLs allow you to upload large chunks of data directly at the source (here, Amazon S3).
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/db/s3-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("fileName");
  const contentType = searchParams.get("contentType");

  if (!fileName || !contentType) {
    return new Response(null, { status: 500 });
  }

  const fileKey = `${Date.now().toString()}-${fileName}`;

  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(uploadParams);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  if (signedUrl) return NextResponse.json({ signedUrl }, { status: 200 });
  return NextResponse.json(null, { status: 500 });
}
