"use client";

import { useState } from "react";

export type VideoItemView = {
  uid: string;
  name: string;
  readyToStream: boolean;
};

export default function VideoGrid({ videos: initial }: { videos: VideoItemView[] }) {
  const [videos, setVideos] = useState(initial);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  async function handleDelete(uid: string) {
    const pin = window.prompt("Silmek için PIN gir:");
    if (!pin) return;

    setDeletingUid(uid);
    try {
      const res = await fetch("/api/videos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, pin }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        window.alert(error ?? "Silinemedi");
        return;
      }

      setVideos((prev) => prev.filter((v) => v.uid !== uid));
    } finally {
      setDeletingUid(null);
    }
  }

  if (videos.length === 0) {
    return <p className="text-neutral-500">Bu kategoride henüz video yok.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((v) => (
        <div key={v.uid} className="space-y-2">
          <div className="relative w-full aspect-video rounded-lg bg-black overflow-hidden">
            {v.readyToStream ? (
              <iframe
                src={`https://iframe.videodelivery.net/${v.uid}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
                İşleniyor…
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-neutral-500 truncate">{v.name}</p>
            <button
              onClick={() => handleDelete(v.uid)}
              disabled={deletingUid === v.uid}
              className="text-sm text-red-600 hover:underline shrink-0 disabled:opacity-40"
            >
              {deletingUid === v.uid ? "Siliniyor…" : "Sil"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
