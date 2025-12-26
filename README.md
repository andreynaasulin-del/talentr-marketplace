# Talentr - Event Marketplace MVP

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?style=flat-square)

A modern event services marketplace connecting clients with professional vendors in Israel. Built with Next.js 15, TypeScript, and Supabase.

## 🌟 Features

### Core Functionality
- **AI-Powered Search** - Natural language vendor discovery with OpenAI
- **Voice Search** - Speech-to-text in 3 languages (EN/RU/HE)
- **Real-time Booking** - Instant booking with email notifications
- **WhatsApp Integration** - One-click contact with vendors
- **Reviews & Ratings** - Social proof system

### Technical Highlights
- **Multi-language Support** - English, Russian, Hebrew with RTL
- **SSR Authentication** - Secure server-side auth with Supabase
- **Dynamic OG Images** - Auto-generated social previews
- **SEO Optimized** - Sitemap, robots.txt, meta tags
- **PWA Ready** - Installable web app
- **Analytics** - Vercel Analytics & Speed Insights

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/event-marketplace-mvp.git
cd event-marketplace-mvp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenAI (optional)
OPENAI_API_KEY=your_openai_key
```

## 📁 Project Structure

```
event-marketplace-mvp/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # AI concierge
│   │   └── email/         # Email notifications
│   ├── vendor/[id]/       # Dynamic vendor pages
│   ├── signin/            # Authentication
│   ├── signup/
│   ├── join/              # Vendor onboarding
│   ├── dashboard/         # Vendor dashboard
│   └── bookings/          # User bookings
├── components/            # React components
│   ├── booking/           # Booking modal
│   ├── HeroSection.tsx    # Landing hero
│   ├── SmartFeed.tsx      # AI chat
│   ├── VendorCard.tsx     # Vendor cards
│   └── ...
├── lib/                   # Utilities
│   ├── supabase.ts        # Supabase client
│   ├── validations.ts     # Zod schemas
│   └── rate-limit.ts      # API rate limiting
├── utils/                 # Helpers
│   └── translations.ts    # i18n (1250+ translations)
└── types/                 # TypeScript types
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (SSR) |
| AI | OpenAI GPT-4 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Analytics | Vercel Analytics |

## 📜 Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript check
```

## 🔒 Security

- Rate limiting on all API endpoints
- Input validation with Zod
- Security headers (CSP, HSTS, etc.)
- Server-side authentication
- SQL injection prevention via Supabase

## 🌐 Deployment

### Vercel (Recommended)

```bash
npx vercel --prod
```

### Environment Variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## 📊 Performance

| Metric | Score |
|--------|-------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Bundle Size (home) | 11.6 kB |

## 🗺️ Roadmap

- [ ] Unit tests (Jest/Vitest)
- [ ] E2E tests (Playwright)
- [ ] Stripe payment integration
- [ ] Push notifications
- [ ] Native mobile apps

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

Built with ❤️ for the Israeli event industry
