import { NextRequest, NextResponse } from "next/server";
import { deleteVideo } from "@/lib/videos";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, pin } = body as { key?: string; pin?: string };

  if (!key || !pin) {
    return NextResponse.json({ error: "key ve pin zorunlu" }, { status: 400 });
  }

  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    return NextResponse.json(
      { error: "ADMIN_PIN tanımlı değil" },
      { status: 500 }
    );
  }

  if (pin !== adminPin) {
    return NextResponse.json({ error: "PIN yanlış" }, { status: 401 });
  }

  await deleteVideo(key);

  return NextResponse.json({ ok: true });
}
