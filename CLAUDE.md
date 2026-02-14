# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start Next.js development server on port 5000
- `npm run dev:jobs` - Start Inngest dev server
- `npm run dev:test` - Start development with email sending enabled (`DANGER_SEND_EMAILS=true`)

### Build & Testing

- `npm run build` - Run Payload migrations and build Next.js
- `npm run lint` - Run ESLint and Prettier checks across all code
- `npm run format` - Auto-fix ESLint issues and format code with Prettier
- `npm run type-check` - Run TypeScript type checking (`npx tsc --noEmit`)

### Payload CMS

- `npm run payload` - Run Payload CLI commands
- `npm run payload:generate` - Regenerate Payload types, import map, and DB schema

## Architecture Overview

This is a Next.js 15 application with Payload CMS integrated for admin functionality.

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (frontend)/(main)/  # Public routes (cookbooks, people, publishers, etc.)
│   ├── (frontend)/auth/    # Auth pages
│   ├── (payload)/admin/    # Payload CMS admin panel
│   └── api/                # API endpoints (auth, admin, inngest)
├── components/             # React components organized by domain
├── core/
│   ├── models/             # Business model classes (Book, Profile, Publisher, etc.)
│   ├── services/           # Service layer with Zod validation
│   ├── gateways/           # External API integrations (Google Books, Google Places)
│   └── policies/           # Authorization policies
├── email/                  # React Email templates
├── jobs/                   # Inngest background job functions
├── lib/                    # Utility libraries
├── payload/
│   ├── collections/        # 20+ Payload CMS collections
│   ├── config/             # Postgres adapter, S3 storage config
│   ├── migrations/         # Database migrations
│   └── plugins/            # Custom Payload plugins
├── style/                  # CSS globals
└── utils/                  # Shared utilities
e2e/                        # Playwright E2E tests (run in CI only)
```

### Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, TipTap editor, Framer Motion
- **Admin**: Payload CMS (integrated into Next.js at `/admin`)
- **Database**: PostgreSQL via Neon, Payload Drizzle ORM
- **Background Jobs**: Inngest
- **Authentication**: NextAuth.js v5
- **Image Storage**: Cloudflare R2 via Payload S3 adapter
- **Monitoring**: Sentry integration
- **Deployment**: Vercel

### Key Configuration Files

- `eslint.config.mjs` - ESLint configuration using flat config format
- `next.config.mjs` - Next.js config with Payload and Sentry wrappers
- `src/payload.config.ts` - Payload CMS configuration
- `.env` / `.env.example` - Environment variables

### Development Notes

- Uses React 19 with specific type overrides
- Image optimization uses Cloudflare in production, unoptimized locally
- Pre-commit hooks run linting and type checking via lint-staged

### Typescript Code Style

- Prefer DRY, readable and well modularised code
- Never use semi colons
- NEVER use `any` type
- Prefer `function` definitions over arrow functions

### Testing

- E2E tests run against production-equivalent environments on main branch merges
- Run `npx playwright install chromium` to set up test browser locally
- Tests are exclusively used for testing preview deployments, do not run locally
