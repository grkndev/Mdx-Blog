# Modern MDX Blog

Next.js 15, TypeScript, Tailwind CSS ve Shadcn UI ile geliştirilmiş modern bir blog sistemi.

## Özellikler

- ✅ **MDX Desteği**: Markdown ve MDX dosyalarından blog içeriği
- ✅ **Syntax Highlighting**: PrismJS ile kod vurgulama
- ✅ **Dark Mode**: Next-themes ile koyu/açık tema desteği
- ✅ **Arama Özelliği**: Fuse.js ile gelişmiş arama
- ✅ **Tag Filtreleme**: Kategoriler ile filtreleme
- ✅ **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- ✅ **SEO Optimizasyonu**: Meta tags ve OpenGraph desteği
- ✅ **Static Site Generation**: Maksimum performans için SSG
- ✅ **TypeScript**: Tip güvenliği
- ✅ **Modern UI**: Shadcn UI componentleri

## Teknoloji Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **MDX Processing**: next-mdx-remote
- **Search**: Fuse.js
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Kurulum

```bash
# Bağımlılıkları kur
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Production server'ı başlat
npm start
```

## Blog Yazısı Ekleme

1. `content/posts/` dizinine yeni bir `.md` veya `.mdx` dosyası oluşturun
2. Frontmatter ile meta bilgileri ekleyin:

```markdown
---
title: "Blog Yazısı Başlığı"
description: "Blog yazısının açıklaması"
tags: ["react", "nextjs", "typescript"]
date: "2025-01-15"
---

# Blog İçeriği

Markdown içeriğinizi buraya yazın...
```

## Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── blog/[slug]/       # Blog detay sayfası
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Ana sayfa
├── components/            # React componentleri
│   ├── ui/               # Shadcn UI componentleri
│   ├── blog-card.tsx     # Blog kartı
│   ├── search-bar.tsx    # Arama bileşeni
│   └── theme-toggle.tsx  # Dark mode toggle
├── content/posts/        # Blog yazıları (MD/MDX)
├── lib/                  # Utility fonksiyonları
│   ├── blog.ts          # Blog data processing
│   ├── mdx.ts           # MDX rendering
│   └── search.ts        # Arama fonksiyonları
└── public/              # Statik dosyalar
```

## Geliştirme

### Yeni Özellik Ekleme

1. Components: `components/` dizininde yeni component oluşturun
2. Utilities: `lib/` dizininde yeni utility fonksiyonları ekleyin
3. Styling: Tailwind CSS classes kullanın
4. Types: TypeScript interface'lerini tanımlayın

### Özelleştirme

- **Tema**: `app/globals.css` dosyasında CSS değişkenlerini düzenleyin
- **Componentler**: `components/` dizinindeki dosyaları özelleştirin
- **Layout**: `app/layout.tsx` dosyasını güncelleyin

## Deployment

### Vercel (Önerilen)

```bash
# Vercel CLI kur
npm i -g vercel

# Deploy et
vercel
```

### Static Export

```bash
npm run build
npm run export
```

## Performans

- **SSG**: Tüm blog sayfaları build time'da oluşturulur
- **Image Optimization**: Next.js Image component kullanımı
- **Bundle Optimization**: Tree shaking ve code splitting
- **Caching**: Aggressive caching stratejileri

## Katkıda Bulun

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## İletişim

Blog sistemi hakkında sorularınız için issue açabilirsiniz.
