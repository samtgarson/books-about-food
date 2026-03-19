# Vinext Migration Summary

## Goal
Migrate this Next.js 16 + Payload CMS app to vinext (Vite-based Next.js reimplementation). Branch: `vinext`.

## Current State
The vinext dev server starts and Payload CMS initializes (connects to DB, pulls schema), but the homepage still returns 500. We're iteratively fixing module resolution/CJS interop errors.

## How to Test
```bash
npm run dev:vinext
# Server starts on port 3001
curl http://localhost:3001/
```
Check `/tmp/vinext-output.log` for errors after running:
```bash
npm run dev:vinext > /tmp/vinext-output.log 2>&1 &
sleep 15
curl -s -o /dev/null -w "%{http_code}" --max-time 60 http://localhost:3001/
tail -30 /tmp/vinext-output.log
```

## Last Error
`Class extends value undefined` in `@tiptap/react/src/EditorContent.tsx` — TipTap's class component (`React.Component`) is undefined in the RSC environment. We just fixed `menu-actions.ts` to import `isNodeSelection` from `@tiptap/core` instead of `@tiptap/react`, but haven't tested yet. This should fix the immediate error since that was the only RSC-side import of `@tiptap/react`.

## Key Files Modified
- **`vite.config.ts`** — Main config with 3 custom plugins (`fixServerActionRerender`, `fixRscHoistCollision`, `fixPayloadAuthjsResolve`), SSR external/noExternal lists, resolve aliases for vinext shims, optimizeDeps for CJS pre-bundling
- **`css-loader.mjs` / `css-loader-hooks.mjs`** — Node ESM loader hooks that: stub CSS/SCSS/SVG/font imports, resolve extensionless imports in `payload-authjs`, redirect `next/*` imports to vinext shims globally
- **`postcss.config.cjs`** — Renamed from `.js` (CJS in ESM project)
- **`prettier.config.cjs`** — Renamed from `.js` (CJS in ESM project)
- **`package.json`** — Added `"type": "module"`, vinext/vite/rsc/sass devDeps, `dev:vinext` and `build:vinext` scripts
- **`src/email/tailwind.config.ts`** — Converted from CJS to ESM
- **`src/email/index.tsx`** — Fixed `open` CJS import (`import pkg from 'open'`)
- **`src/components/form/select/index.tsx`** — Changed `export *` to named type exports (RSC plugin limitation)
- **`src/components/atoms/sheet/index.tsx`** — Changed `export *` to named exports (RSC plugin limitation)
- **`src/lib/editor/menu-actions.ts`** — Import from `@tiptap/core` instead of `@tiptap/react`
- **`src/jobs/lib/generate-palette/get-colors.ts`** — Lazy-load `@vibrant/*` CJS packages inside function body to avoid Vite module runner CJS interop failures

## Issues Already Resolved
1. **payload-authjs extensionless imports** — Custom ESM loader hook + Vite plugin
2. **next/* imports from node_modules** — Global redirect to vinext shims in ESM loader
3. **CSS/SCSS/SVG asset imports in Node** — Stubbed in ESM loader hooks
4. **`@payloadcms/next` cookies identifier collision** — `fixRscHoistCollision` Vite plugin
5. **Server action infinite re-render loop** — `fixServerActionRerender` Vite plugin
6. **`export *` in `"use client"` files** — Converted to named exports
7. **`@vibrant/*` CJS interop** — Lazy-loaded with `createRequire` inside function
8. **`open` CJS named exports** — Changed to default import + destructure
9. **CJS config files** — Renamed to `.cjs`

## Pattern for Fixing Future Errors
The errors follow a pattern:
- **"Cannot find module X"** → Add to ESM loader resolve hook or Vite resolve alias
- **"Unknown file extension .css/.svg"** → Add extension to STUB_EXTENSIONS in css-loader-hooks.mjs
- **"__cjs_module_runner_transform" / "Class extends undefined"** → Package can't run in Vite's module runner. Either externalize to Node (`ssr.external`), lazy-load with `createRequire`, or fix the import chain so it's not loaded in RSC
- **"Named export X not found" (CJS)** → Change to default import + destructure, or add to `ssr.external`
- **"unsupported ExportAllDeclaration"** → Convert `export *` to named exports in `"use client"` files
- **"Identifier X already declared"** → RSC hoisting collision, handle in `fixRscHoistCollision` plugin

## Reference
The approach is based on https://github.com/payloadcms/payload/discussions/15761#discussioncomment-16076420 by @youanden who got Payload partially working with vinext.

## What's NOT Done Yet
- Full homepage render (still hitting errors in the module graph)
- Switching main `dev`/`build`/`start` scripts from Next.js to vinext
- Sentry integration (client works, server needs manual setup)
- next-auth compatibility (flagged as incompatible, may need migration to better-auth)
- Production build (`vinext build`)
- Deployment configuration
