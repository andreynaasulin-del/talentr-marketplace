# 🎭 Talentr - Event Marketplace

Premium event vendor marketplace for Israel, built with Next.js 15 and Framer Motion.

## ✨ Features

- **🎨 Premium UI/UX** - Wolt-inspired minimalist design with smooth Framer Motion animations
- **🌍 Multi-language** - Full RTL support for Hebrew, Russian, and English
- **🔍 Smart Search** - AI-powered vendor discovery
- **📱 Mobile-First** - Fully responsive design
- **⚡ Performance** - Optimized with Next.js 15 App Router
- **🔐 Authentication** - Supabase integration

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deployment:** Vercel

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build
npm start
```

## 🎬 Animations

This project features advanced Framer Motion animations:

- **Hero Section** - Staggered text reveal animations
- **Vendor Cards** - Hover lift, image zoom, and iOS-style tap effects
- **Scroll Animations** - Viewport-triggered stagger animations
- **Interactive Elements** - Smooth transitions on all buttons and links

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # React components
├── lib/                   # Utilities and Supabase client
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── supabase/             # Database schemas and seeds
└── public/               # Static assets
```

## 🌐 Live Demo

[https://event-marketplace-mvp.vercel.app](https://event-marketplace-mvp.vercel.app)

## 📝 License

MIT

---

**Made with ❤️ for the Israeli event community**
