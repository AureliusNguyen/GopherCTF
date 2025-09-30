# CTF Platform

A modern Capture The Flag (CTF) competition platform built with Next.js, inspired by CTFd.

## Features

- 🎯 **Challenge System**: Multiple categories (Web, Crypto, Forensics, Pwn, Reversing, Misc)
- 🏆 **Dynamic Scoring**: Points decrease as more teams solve challenges
- 👥 **Team & Individual Competition**: Compete solo or form teams
- 📊 **Real-time Leaderboard**: Track rankings and progress
- 🔐 **Secure Authentication**: Powered by Clerk
- 🎨 **Modern UI**: Dark theme with shadcn/ui components
- ⚡ **Fast & Scalable**: Built on Next.js 15 with Vercel deployment support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **UI Components**: shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL (Prisma ORM)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:

The `.env` file should contain:
```env
# Database
DATABASE_URL="your_postgres_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/challenges
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/challenges
```

3. Set up the database:
```bash
# Push schema to database
pnpm db:push

# Seed with sample challenges
pnpm db:seed
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Commands

```bash
# Push schema changes to database
pnpm db:push

# Seed database with sample data
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio
```

## Project Structure

```
ctf-platform/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Main application pages
│   │   ├── challenges/      # Challenge list and details
│   │   ├── leaderboard/     # Rankings
│   │   └── profile/         # User profile
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── challenges/          # Challenge components
│   └── leaderboard/         # Leaderboard components
├── lib/
│   ├── db.ts                # Prisma client
│   ├── scoring.ts           # Dynamic scoring logic
│   └── utils.ts             # Utilities
└── prisma/
    ├── schema.prisma        # Database schema
    └── seed.ts              # Seed script
```

## Deployment to Vercel

### 1. Database Setup

**Option A: Vercel Postgres (Recommended)**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Link your project
vercel link

# Create Vercel Postgres database
vercel postgres create

# Pull environment variables
vercel env pull .env.local
```

**Option B: External PostgreSQL**
- Use any PostgreSQL provider (Railway, Supabase, etc.)
- Add connection string to Vercel environment variables

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy!

### 3. Seed Production Database

After deployment:
```bash
vercel env pull
pnpm db:push
pnpm db:seed
```

## Configuration

### Dynamic Scoring

The scoring algorithm decreases points as more teams solve:
- Formula: `points = basePoints * (1 - 0.05 * solves)`
- Minimum points threshold prevents points from going too low
- Configurable in `lib/scoring.ts`

## Features Roadmap

- [x] Challenge system with categories
- [x] Dynamic scoring
- [x] Flag submission
- [x] Leaderboard (teams & individuals)
- [x] User profiles
- [ ] Admin panel for challenge management
- [ ] Team creation/management
- [ ] Hints system
- [ ] Real-time updates

## License

MIT License
