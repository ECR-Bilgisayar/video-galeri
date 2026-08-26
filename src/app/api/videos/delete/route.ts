import { NextRequest, NextResponse } from "next/server";
import { deleteVideo } from "@/lib/stream";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));
  try {
    const body = await req.json();
    const { uid, pin } = body as { uid?: string; pin?: string };

    if (!uid || !pin) {
      return NextResponse.json({ error: "uid ve pin zorunlu" }, { status: 400, headers });
    }

    const adminPin = process.env.ADMIN_PIN;
    if (!adminPin) {
      return NextResponse.json(
        { error: "ADMIN_PIN tanımlı değil" },
        { status: 500, headers }
      );
    }

    if (pin !== adminPin) {
      return NextResponse.json({ error: "PIN yanlış" }, { status: 401, headers });
    }

    await deleteVideo(uid);

    return NextResponse.json({ ok: true }, { headers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Beklenmeyen sunucu hatası" },
      { status: 500, headers }
    );
  }
}
