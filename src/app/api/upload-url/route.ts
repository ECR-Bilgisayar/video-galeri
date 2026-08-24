import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, getR2Bucket } from "@/lib/r2";
import { getCategory } from "@/lib/categories";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, filename, contentType } = body as {
    category?: string;
    filename?: string;
    contentType?: string;
  };

  if (!category || !filename || !contentType) {
    return NextResponse.json(
      { error: "category, filename ve contentType zorunlu" },
      { status: 400 }
    );
  }

  if (!getCategory(category)) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
  }

  if (!contentType.startsWith("video/")) {
    return NextResponse.json(
      { error: "Sadece video dosyaları yüklenebilir" },
      { status: 400 }
    );
  }

  const key = `${category}/${Date.now()}-${sanitizeFilename(filename)}`;

  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: 300,
  });

  return NextResponse.json({ uploadUrl, key });
}
