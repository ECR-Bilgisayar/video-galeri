import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { listVideos } from "@/lib/videos";

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

      {videos.length === 0 ? (
        <p className="text-neutral-500">Bu kategoride henüz video yok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div key={v.key} className="space-y-2">
              <video
                src={v.url}
                controls
                preload="metadata"
                className="w-full aspect-video rounded-lg bg-black"
              />
              <p className="text-sm text-neutral-500 truncate">{v.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
