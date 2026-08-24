export type Category = {
  slug: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "kayit-desk", label: "Kayıt Desk" },
  { slug: "tv", label: "TV" },
  { slug: "kiosk", label: "Kiosk / Dokunmatik TV" },
  { slug: "proje-isi", label: "Proje İşi" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
