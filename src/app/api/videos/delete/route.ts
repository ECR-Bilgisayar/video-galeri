import { NextRequest, NextResponse } from "next/server";
import { deleteVideo } from "@/lib/stream";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, pin } = body as { uid?: string; pin?: string };

  if (!uid || !pin) {
    return NextResponse.json({ error: "uid ve pin zorunlu" }, { status: 400 });
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

  await deleteVideo(uid);

  return NextResponse.json({ ok: true });
}
