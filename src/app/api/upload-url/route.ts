import { NextRequest, NextResponse } from "next/server";
import { createDirectUpload } from "@/lib/stream";
import { getCategory } from "@/lib/categories";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, filename } = body as {
    category?: string;
    filename?: string;
  };

  if (!category || !filename) {
    return NextResponse.json(
      { error: "category ve filename zorunlu" },
      { status: 400 }
    );
  }

  if (!getCategory(category)) {
    return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
  }

  const { uploadURL } = await createDirectUpload(category, filename);

  return NextResponse.json({ uploadUrl: uploadURL });
}
