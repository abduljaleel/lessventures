# Less Ventures

**Less is more.** The venture studio operating system for disciplined builders.

Part of the [12 Cities](https://github.com/abduljaleel) venture ecosystem.

## What it does

Less Ventures is an internal operating system for venture studios. It provides the structure and discipline needed to launch, track, and govern a portfolio of ventures.

### Core Features

- **Venture Pipeline Tracker** — Track ventures across stages (Idea, Validation, Build, Scale, Sunset) with tier classification
- **Stage Gate Reviews** — Structured decision checkpoints with validation checklists (Customer Discovery, Technical Feasibility, Commercial Viability, Legal/Compliance) and Proceed/Pivot/Kill decisions
- **Capital Allocation** — Budget tracking, spend monitoring, and burn rate analysis per venture and portfolio-wide
- **Portfolio Analytics** — Stage distribution, capital utilization, tier breakdown, and portfolio health indicators
- **Venture Playbooks** — Reusable templates for customer discovery, technical validation, MVP design, and governance

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Auth & Database:** Supabase (Auth, Postgres, RLS)
- **Deployment:** Vercel

## Getting Started

```bash
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase URL and anon key

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, auth callback
│   ├── (dashboard)/
│   │   ├── dashboard/   # Portfolio overview with metrics
│   │   ├── ventures/    # Venture list, detail, stage gates, capital
│   │   ├── portfolio/   # Analytics and allocation
│   │   ├── playbook/    # Validation templates and checklists
│   │   └── settings/    # User settings
│   └── page.tsx         # Landing page
├── components/          # Layout + shadcn/ui components
├── lib/
│   ├── data/            # Venture seed data (12 Cities portfolio)
│   ├── supabase/        # Client and server utilities
│   └── config.ts        # App configuration and nav
└── types/
```

## 12 Cities Role

Less Ventures is the **governance layer** — it enforces stage discipline, capital efficiency, and validation rigor across the portfolio.

**Domain:** lessventures.us | **Tier:** 1 (Core) | **Layer:** Portfolio Compounding

## License

Private — 12 Cities Venture System
