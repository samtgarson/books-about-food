# CLAUDE.md - Web Frontend

This file provides guidance to Claude Code (claude.ai/code) when working with the web frontend application.

## Development Commands

### Frontend Development

- `npm run dev` - Start Next.js development server on port 5000 (from root) or `cd web && npm run dev`
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npx tsc --noEmit` - Type check without emitting files (from web directory)

## Architecture Overview

### Next.js App Router Structure

- **App Directory**: `/src/app/` using Next.js 15 App Router
- **Route Groups**: `(main)` for main application routes
- **Protected Routes**: `/account`, `/edit/*` require authentication
- **API Routes**: `/src/app/api/` for server-side endpoints
- **Middleware**: Authentication and route protection via NextAuth.js

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main application routes
│   ├── api/               # API endpoints
│   └── auth/              # Authentication pages
├── components/            # React components organized by domain
│   ├── atoms/             # Basic UI components (Button, Container, etc.)
│   ├── books/             # Book-related components
│   ├── auth/              # Authentication components
│   ├── edit/              # Book editing workflow
│   └── ...                # Domain-specific component groups
├── lib/                   # Utility libraries
├── utils/                 # Shared utilities
├── style/                 # Styling configuration
└── types/                 # TypeScript type definitions
```

## Component Architecture

### Component Organization

- **Atomic Design**: Components organized from atoms → domain-specific groupings
- **Wrap Component**: `<Wrap c={Component} />` for serializing complex props (model class instances) between server and client components
- **Model Classes**: Business model instances used throughout app for domain-specific functionality
- **Domain Groupings**: Components grouped by functionality (books, auth, profiles, etc.)

### Key Patterns

- **Service Integration**: Use `call(service, args)` to interact with backend services
- **Server Components**: Homepage and data-fetching pages are Server Components
- **Suspense Boundaries**: Strategic use for loading states
- **Error Boundaries**: Sentry integration for error tracking

## Authentication & Authorization

### NextAuth.js v5 Setup

- **Provider**: Email-based authentication with magic links
- **Adapter**: Prisma adapter for database integration
- **Middleware**: Route protection in `/src/middleware.ts`
- **Protected Paths**: `/account/*`, `/edit/*` routes require authentication
- **Session**: JWT-based sessions with user role and publisher memberships

### User Context

- Access user via `await getSessionUser()` in server components
- User roles: `ADMIN`, `MEMBER`, etc.
- Publisher memberships for content management permissions

## Styling System

### Tailwind CSS Configuration

- **Shared Config**: Extends `@books-about-food/shared/tailwind.config`
- **Custom Colors**: Defined in `theme.js` (black, white, grey, sand, khaki, neutralGrey)
- **Typography**: Custom font loading via Next.js `localFont` (Graphik)
- **Design System**: Consistent spacing, typography, and color usage

### Styling Conventions

- Use semantic color names (khaki, sand, etc.) from theme
- Responsive design with mobile-first approach
- Consistent component styling patterns
- Custom CSS classes for typography (`.all-caps`, etc.)

## Data Fetching & Services

### Service Layer Integration

- **Call Pattern**: `call(serviceClass, args, options)` for backend integration
- **Caching**: Redis-based caching for non-authenticated services
- **Error Handling**: Structured error responses with Sentry integration
- **Type Safety**: Full TypeScript integration with service layer

### Data Patterns

- **Server Components**: Direct service calls in page components
- **Static Generation**: `revalidate` for ISR on key pages
- **Dynamic Imports**: Code splitting for large components

## Key Features & Workflows

### Content Management

- **Book Editing**: Multi-step editing workflow (`/edit/[slug]/(steps)/`)
- **Admin Interface**: Content management at `/admin/*`
- **Image Handling**: Cloudflare integration for optimized images
- **Rich Text**: TipTap editor integration

### User Experience

- **Progressive Enhancement**: Server-first with client interactions
- **Loading States**: Suspense boundaries and skeleton states
- **Toast Notifications**: Sonner integration for user feedback
- **Analytics**: Fathom and Vercel Speed Insights integration

## Development Guidelines

### File Organization

- Group related components in domain directories
- Use TypeScript for all new components
- Follow existing naming conventions (kebab-case for files)
- Place shared utilities in `/utils/` or `/lib/`

### Component Development

- Prefer Server Components when possible
- Use `'use client'` directive only when necessary
- Use `Wrap` component when passing model class instances to client components
- Implement proper error boundaries
- Follow accessibility best practices

### Testing & Quality

- Run `npx tsc --noEmit` before committing for type checking
- Use ESLint and Prettier configurations
- Test authentication flows in development
- Verify responsive design across breakpoints

### Environment Variables

- Copy `.env.example` to `.env.local` for development
- Required for authentication, database, and external services
- Never commit actual environment variables to version control
