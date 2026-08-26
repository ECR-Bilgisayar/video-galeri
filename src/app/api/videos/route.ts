import { NextRequest, NextResponse } from "next/server";
import { listVideos } from "@/lib/stream";
import { getCategory } from "@/lib/categories";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));
  const category = req.nextUrl.searchParams.get("category");

  if (!category || !getCategory(category)) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400, headers });
  }

  const videos = await listVideos(category);

  return NextResponse.json({ videos }, { headers });
}
