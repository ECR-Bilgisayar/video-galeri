import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Video Galerisi</h1>
        <p className="text-neutral-500">Kategoriye göre videoları izle</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-6 py-8 text-center text-lg font-medium hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            {c.label}
          </Link>
        ))}
      </div>

      <Link
        href="/upload"
        className="rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 py-3 font-medium"
      >
        Video Yükle
      </Link>
    </main>
  );
}
