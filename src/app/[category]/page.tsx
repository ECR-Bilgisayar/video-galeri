import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { listVideos } from "@/lib/videos";
import VideoGrid from "./VideoGrid";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage(props: PageProps<"/[category]">) {
  const { category: slug } = await props.params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const videos = await listVideos(slug);

  return (
    <main className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="text-sm text-neutral-500 hover:underline">
            ← Kategoriler
          </Link>
          <h1 className="text-2xl font-semibold mt-1">{category.label}</h1>
        </div>
        <Link
          href="/upload"
          className="rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2 text-sm font-medium"
        >
          Video Yükle
        </Link>
      </div>

      <VideoGrid
        videos={videos.map((v) => ({ key: v.key, url: v.url, name: v.name }))}
      />
    </main>
  );
}
