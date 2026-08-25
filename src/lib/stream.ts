const API_BASE = "https://api.cloudflare.com/client/v4";

function getAccountId(): string {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!id) throw new Error("CLOUDFLARE_ACCOUNT_ID tanımlı değil");
  return id;
}

function getApiToken(): string {
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_STREAM_API_TOKEN tanımlı değil");
  return token;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getApiToken()}`,
    "Content-Type": "application/json",
  };
}

export type StreamVideo = {
  uid: string;
  category: string;
  name: string;
  readyToStream: boolean;
  created: string;
};

export async function createDirectUpload(
  category: string,
  filename: string
): Promise<{ uploadURL: string; uid: string }> {
  const res = await fetch(
    `${API_BASE}/accounts/${getAccountId()}/stream/direct_upload`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        maxDurationSeconds: 3600,
        meta: { category, name: filename },
      }),
    }
  );

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(
      data.errors?.[0]?.message ?? "Cloudflare Stream upload URL alınamadı"
    );
  }

  return { uploadURL: data.result.uploadURL, uid: data.result.uid };
}

export async function listVideos(category: string): Promise<StreamVideo[]> {
  const res = await fetch(`${API_BASE}/accounts/${getAccountId()}/stream`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.errors?.[0]?.message ?? "Videolar listelenemedi");
  }

  type RawVideo = {
    uid: string;
    meta?: { category?: string; name?: string };
    readyToStream?: boolean;
    created: string;
  };

  return (data.result as RawVideo[])
    .filter((v) => v.meta?.category === category)
    .map((v) => ({
      uid: v.uid,
      category: v.meta?.category ?? "",
      name: v.meta?.name ?? v.uid,
      readyToStream: v.readyToStream ?? false,
      created: v.created,
    }))
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

export async function deleteVideo(uid: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/accounts/${getAccountId()}/stream/${uid}`,
    { method: "DELETE", headers: authHeaders() }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.errors?.[0]?.message ?? "Video silinemedi");
  }
}
