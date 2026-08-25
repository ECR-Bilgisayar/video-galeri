# Video Galerisi

Etkinlikte çekilen videoların kategoriye göre yüklenip izlendiği basit bir galeri. Telefondan video seçilir, tarayıcıdan direkt Cloudflare Stream'e yüklenir; Stream videoyu otomatik olarak H.264'e çevirip her cihazda/tarayıcıda oynatılabilir hale getirir (iPhone'ların varsayılan HEVC formatı Chrome/Edge/Firefox'ta oynamadığı için bu adım gerekli).

Kategoriler `src/lib/categories.ts` içinde tanımlı: Kayıt Desk, TV, Kiosk / Dokunmatik TV, Proje İşi.

## Cloudflare Stream kurulumu

1. Cloudflare dashboard → **Stream** sekmesini aç, ilk kullanımda aktive etmen istenebilir (kullanım bazlı ücretlendirme, saklanan/izlenen dakika başına).
2. **Account ID**'yi bul: Stream veya herhangi bir Cloudflare ürün sayfasında sağ sidebar'da görünüyor (R2 için kullandığın Account ID ile aynı).
3. Bir API token oluştur: sağ üstteki profil ikonu → **My Profile → API Tokens → Create Token** → **Custom Token** → izin olarak **Account → Stream → Edit** seç, hesabına scope et → oluştur, token'ı kopyala (bir kere gösterilir).
4. `.env.local.example` dosyasını `.env.local` olarak kopyala ve doldur:

```
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_STREAM_API_TOKEN=
ADMIN_PIN=              # video silmek için istenen PIN, sen belirle
```

Vercel'e deploy ederken aynı değişkenleri Vercel proje ayarlarından (Environment Variables) da eklemen gerekiyor.

> Eski R2 tabanlı sürümden kalan `R2_*` değişkenlerini Vercel'den silebilirsin, artık kullanılmıyor.

## Geliştirme

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

## Deploy

Proje Vercel'e bağlanıp deploy edilebilir; domain Vercel üzerinden yönetiliyor. Videolar Cloudflare Stream'de saklanıp servis ediliyor.
