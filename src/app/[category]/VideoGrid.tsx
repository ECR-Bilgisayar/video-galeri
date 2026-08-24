"use client";

import { useState } from "react";

export type VideoItemView = {
  key: string;
  url: string;
  name: string;
};

export default function VideoGrid({ videos: initial }: { videos: VideoItemView[] }) {
  const [videos, setVideos] = useState(initial);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  async function handleDelete(key: string) {
    const pin = window.prompt("Silmek için PIN gir:");
    if (!pin) return;

    setDeletingKey(key);
    try {
      const res = await fetch("/api/videos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, pin }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        window.alert(error ?? "Silinemedi");
        return;
      }

      setVideos((prev) => prev.filter((v) => v.key !== key));
    } finally {
      setDeletingKey(null);
    }
  }

  if (videos.length === 0) {
    return <p className="text-neutral-500">Bu kategoride henüz video yok.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((v) => (
        <div key={v.key} className="space-y-2">
          <video
            src={v.url}
            controls
            preload="metadata"
            className="w-full aspect-video rounded-lg bg-black"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-neutral-500 truncate">{v.name}</p>
            <button
              onClick={() => handleDelete(v.key)}
              disabled={deletingKey === v.key}
              className="text-sm text-red-600 hover:underline shrink-0 disabled:opacity-40"
            >
              {deletingKey === v.key ? "Siliniyor…" : "Sil"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
