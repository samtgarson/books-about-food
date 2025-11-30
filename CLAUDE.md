# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start all development servers (web frontend on :5000, admin backend on :5001, email preview on :3883, Inngest dev server on :8288)
- `npm run dev:web` - Start only the web frontend development server
- `npm run dev:test` - Start development with email sending enabled (`DANGER_SEND_EMAILS=true`)

### Build & Testing

- `npm run build` - Build all packages using Turbo
- `npm run test` - Run tests across all packages
- `npm run lint` - Run ESLint and Prettier checks across all code
- `npm run format` - Auto-fix ESLint issues and format code with Prettier
- `npm run type-check` - Run TypeScript type checking across all workspaces (`npx -ws tsc --noEmit`)

### Database Operations

- `npm run db:build` - Generate Prisma client and run migrations (from packages/database)
- `prisma format` - Format the Prisma schema file

## Architecture Overview

This is a monorepo using npm workspaces and Turbo for orchestration. The application consists of:

### Core Applications

- **Web Frontend** (`/web`) - Next.js 15 user-facing application running on port 5000
- **Admin Backend** (`/admin`) - Koa.js server with Forest Admin integration and Inngest functions, running on port 5001

### Shared Packages (`/packages/`)

- **core** - Business logic services with consistent APIs, organized into models, services, gateways, policies, and jobs
- **database** - Prisma schema and client configuration using Neon PostgreSQL
- **email** - React Email templates with development preview server
- **jobs** - Background job functions using Inngest
- **e2e** - End-to-end tests using Playwright
- **shared** - Common utilities and types
- **prettier-config** - Shared Prettier configuration

### Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, TipTap editor, Framer Motion
- **Backend**: Koa.js, Forest Admin, Inngest for job orchestration
- **Database**: PostgreSQL via Neon, Prisma ORM
- **Authentication**: NextAuth.js v5
- **Monitoring**: Sentry integration
- **Deployment**: Vercel (web), Heroku (admin)

### Key Configuration Files

- `turbo.json` - Defines build pipeline dependencies and caching
- `eslint.config.mjs` - ESLint configuration using flat config format
- Database requires environment variables set per workspace (see `.env.example` files)

### Development Notes

- Uses React 19 with specific type overrides
- Workspace dependencies use `*` for local packages
- Prisma client generation is a build dependency for other packages
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
