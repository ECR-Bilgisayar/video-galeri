# Video Galerisi

Etkinlikte çekilen videoların kategoriye göre yüklenip izlendiği basit bir galeri. Telefondan video seçilir, tarayıcıdan direkt Cloudflare R2'ye yüklenir; sunucuda video dosyası taşınmaz, sadece presigned URL üretilir.

Kategoriler `src/lib/categories.ts` içinde tanımlı: Kayıt Desk, TV, Kiosk / Dokunmatik TV, Proje İşi.

## Cloudflare R2 kurulumu

1. Cloudflare panelinde **R2** → yeni bucket oluştur (örn. `video-galeri`).
2. **Settings → Public Access**: bucket'ı public yap, ya bir R2.dev subdomain aç ya da kendi domainini bağla. Verilen URL'yi `R2_PUBLIC_URL` olarak kullanacaksın (sonunda `/` olmadan, örn. `https://pub-xxxx.r2.dev`).
3. **Settings → CORS Policy**: tarayıcıdan direkt PUT yapılabilmesi için aşağıdakini ekle (geliştirmede `*`, canlıda kendi domainini yaz):

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"]
  }
]
```

4. **R2 → Manage API Tokens**: bucket için Object Read & Write izinli bir API token oluştur, `Access Key ID` ve `Secret Access Key` değerlerini al.
5. `.env.local.example` dosyasını `.env.local` olarak kopyala ve doldur:

```
R2_ACCOUNT_ID=       # Cloudflare hesap ID'si (R2 API panelinde görünür)
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=video-galeri
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

Vercel'e deploy ederken aynı değişkenleri Vercel proje ayarlarından (Environment Variables) da eklemen gerekiyor.

## Geliştirme

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

## Deploy

Proje Vercel'e bağlanıp deploy edilebilir; domain Vercel üzerinden yönetiliyor. Video dosyaları Vercel'den değil, doğrudan R2'den servis edilir.
