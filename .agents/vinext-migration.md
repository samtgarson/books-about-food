# Vinext Migration Summary

## Goal

Migrate this Next.js 16 + Payload CMS app to vinext (Vite-based Next.js reimplementation). Branch: `vinext`.

## Current State

The vinext dev server works end-to-end: homepage, auth (Better Auth), account page, client-side navigation with Suspense. Auth has been migrated from NextAuth to Better Auth (which vinext supports natively). Next steps: production build, script switchover, deployment config.

## How to Test

```bash
npm run dev:vinext
# Server starts on port 5000
```

## Key Files Modified

- **`vite.config.ts`** — Main config with 4 custom plugins (`fixServerActionRerender`, `fixRscHoistCollision`, `fixNavigationSuspense`, `fixRouteHandlerNextRequest`), SSR external/noExternal lists, resolve aliases for vinext shims, optimizeDeps for CJS pre-bundling
- **`css-loader.mjs` / `css-loader-hooks.mjs`** — Node ESM loader hooks that: stub CSS/SCSS/SVG/font imports, resolve extensionless imports in `payload-auth`, redirect `next/*` imports to vinext shims globally
- **`postcss.config.cjs`** — Renamed from `.js` (CJS in ESM project)
- **`prettier.config.cjs`** — Renamed from `.js` (CJS in ESM project)
- **`package.json`** — Added `"type": "module"`, vinext/vite/rsc/sass devDeps, `dev:vinext` and `build:vinext` scripts
- **`src/auth.ts`** — Migrated from NextAuth/payload-authjs to Better Auth/payload-auth
- **`src/lib/auth/options.ts`** — Better Auth configuration (Google OAuth, magic links, custom session)
- **`src/lib/auth/client.ts`** — Better Auth client
- **`src/utils/user.ts`** — Uses `auth.api.getSession({ headers })` instead of NextAuth `auth()`
- **`src/components/auth/*`** — Updated sign-in/sign-out to use Better Auth client + server actions

## Vite Plugins (in vite.config.ts)

1. **`fixServerActionRerender`** — Skip root re-render when server action returns data (prevents Payload Form infinite loop)
2. **`fixNavigationSuspense`** — Replace `flushSync` with `startTransition` in navigation renders (fixes Suspense boundaries)
3. **`fixRouteHandlerNextRequest`** — Wrap raw Request as NextRequest for App Router route handlers (Better Auth needs `.nextUrl`)
4. **`fixRscHoistCollision`** — Rename colliding `cookies` variable in Payload's switchLanguageServerAction

## Issues Already Resolved

1. **payload-authjs extensionless imports** — Custom ESM loader hook + Vite plugin
2. **next/\* imports from node_modules** — Global redirect to vinext shims in ESM loader
3. **CSS/SCSS/SVG asset imports in Node** — Stubbed in ESM loader hooks
4. **`@payloadcms/next` cookies identifier collision** — `fixRscHoistCollision` Vite plugin
5. **Server action infinite re-render loop** — `fixServerActionRerender` Vite plugin
6. **`export *` in `"use client"` files** — Converted to named exports
7. **`@vibrant/*` CJS interop** — Lazy-loaded with `createRequire` inside function
8. **`open` CJS named exports** — Changed to default import + destructure
9. **CJS config files** — Renamed to `.cjs`
10. **`@tiptap/react` in RSC graph** — Barrel import pulled `@tiptap/react` into server render; fixed by importing directly from submodule + added `@tiptap/*` to `ssr.external`
11. **react-server-dom dev/prod mismatch** — Resolve alias forcing development CJS build
12. **Navigation Suspense stuck** — `flushSync` prevents Suspense retry; replaced with `startTransition`
13. **Route handler raw Request** — vinext passes plain Request, Better Auth needs NextRequest; wrapped in plugin
14. **next-auth incompatibility** — Migrated to Better Auth (payload-auth plugin)
15. **Google logo 400 via image optimizer** — Changed from `next/image` to native `<img>` for inline SVG
16. **@vercel/speed-insights removed** — Not needed with vinext; inlined `computeRoute` in `useRoute`
17. **Next.js generated types (RouteContext/LayoutProps)** — Replaced with inline types

## Pattern for Fixing Future Errors

- **"Cannot find module X"** → Add to ESM loader resolve hook or Vite resolve alias
- **"Unknown file extension .css/.svg"** → Add extension to STUB_EXTENSIONS in css-loader-hooks.mjs
- **"\_\_cjs_module_runner_transform" / "Class extends undefined"** → Package can't run in Vite's module runner. Either externalize to Node (`ssr.external`), lazy-load with `createRequire`, or fix the import chain
- **"Named export X not found" (CJS)** → Change to default import + destructure, or add to `ssr.external`
- **"unsupported ExportAllDeclaration"** → Convert `export *` to named exports in `"use client"` files
- **"Identifier X already declared"** → RSC hoisting collision, handle in `fixRscHoistCollision` plugin

## Reference

The approach is based on https://github.com/payloadcms/payload/discussions/15761#discussioncomment-16076420 by @youanden who got Payload partially working with vinext.

## What's NOT Done Yet

- ~~Full homepage render~~ ✅ Done
- ~~Auth (next-auth)~~ ✅ Done (migrated to Better Auth)
- ~~Client-side navigation with Suspense~~ ✅ Done
- ~~Account page / authenticated pages~~ ✅ Done
- ~~Production build (`vite build`)~~ ✅ Done
- ~~Switch main `dev`/`build`/`start` scripts~~ ✅ Done (old scripts kept as `:next` variants)
- Sentry integration (client works, server needs manual setup)
- Deployment configuration
- Fix circular dependency warnings (sheet/content.tsx re-exports)
- Optimize large chunks (mapbox-gl, cookbook-submitted)
