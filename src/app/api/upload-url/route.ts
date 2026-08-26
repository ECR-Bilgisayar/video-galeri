import { NextRequest, NextResponse } from "next/server";
import { createDirectUpload } from "@/lib/stream";
import { getCategory } from "@/lib/categories";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));
  const body = await req.json();
  const { category, filename } = body as {
    category?: string;
    filename?: string;
  };

  if (!category || !filename) {
    return NextResponse.json(
      { error: "category ve filename zorunlu" },
      { status: 400, headers }
    );
  }

  if (!getCategory(category)) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400, headers });
  }

  const { uploadURL } = await createDirectUpload(category, filename);

  return NextResponse.json({ uploadUrl: uploadURL }, { headers });
}
