"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

type Status = "idle" | "uploading" | "done" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setError("");

    try {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          filename: file.name,
          contentType: file.type || "video/mp4",
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Yükleme linki alınamadı");
      }

      const { uploadUrl } = await res.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "video/mp4" },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("Video yüklenemedi");
      }

      setStatus("done");
      setTimeout(() => router.push(`/${category}`), 800);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Link href="/" className="text-sm text-neutral-500 hover:underline">
            ← Kategoriler
          </Link>
          <h1 className="text-2xl font-semibold mt-1">Video Yükle</h1>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Video</label>
          <input
            type="file"
            accept="video/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading"}
          className="w-full rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 py-3 font-medium disabled:opacity-40"
        >
          {status === "uploading" ? "Yükleniyor…" : "Yükle"}
        </button>

        {status === "done" && (
          <p className="text-sm text-green-600">Video yüklendi ✓</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </main>
  );
}
