import path from 'node:path'
import { fileURLToPath } from 'node:url'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { cloudflare } from '@cloudflare/vite-plugin'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import vinext from 'vinext'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { defineConfig, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vinextShimsDir = path.join(__dirname, 'node_modules/vinext/dist/shims')

/**
 * vinext shims next/dist/compiled/@edge-runtime/cookies but only exports
 * RequestCookies/ResponseCookies. payload-auth needs parseSetCookie from
 * the real @edge-runtime/cookies. Rewrite the import in the source since
 * vinext's alias takes precedence over resolveId and persists across
 * multi-environment builds.
 */
function fixEdgeRuntimeCookies(): Plugin {
  return {
    name: 'fix-edge-runtime-cookies',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('payload-auth')) return
      if (!code.includes('next/dist/compiled/@edge-runtime/cookies')) return
      return {
        code: code.replace(
          /from ['"]next\/dist\/compiled\/@edge-runtime\/cookies['"]/g,
          'from "@edge-runtime/cookies"'
        ),
        map: null
      }
    }
  }
}

/**
 * Stub SCSS imports inside @payloadcms packages during production builds.
 * Rollup can't process SCSS and fails to analyze modules that import it,
 * causing "is not exported" errors even though the JS exports are valid.
 */
function stubPayloadScss(): Plugin {
  return {
    name: 'stub-payload-scss',
    enforce: 'pre',
    // Strip SCSS import lines from @payloadcms and payload-auth source files.
    // Rollup's static export analysis runs before resolveId, so we must remove
    // the import at the source level to prevent parse failures.
    transform(code, id) {
      if (
        (id.includes('@payloadcms') || id.includes('payload-auth')) &&
        code.includes('.scss')
      ) {
        return {
          code: code.replace(/^import\s+['"][^'"]*\.scss['"];?\s*$/gm, ''),
          map: null
        }
      }
    }
  }
}

/**
 * Patch node_modules sources before Vite starts for Workers compatibility.
 * - drizzle-kit/api: Stub migration tooling import (not needed at runtime)
 * - pluralize: Fix UMD wrapper that uses `this` as root (undefined in ESM strict mode)
 */
function patchNodeModules(): Plugin {
  const patches: Array<{
    file: string
    find: string | RegExp
    replace: string
    // If present and already in the file, skip — keeps patches idempotent for
    // patches whose `replace` still contains `find` (would otherwise re-apply).
    skipIf?: string
  }> = [
    {
      file: 'node_modules/@payloadcms/drizzle/dist/postgres/requireDrizzleKit.js',
      find: "require('drizzle-kit/api')",
      replace: '({})'
    },
    {
      // pluralize uses `(function(root, pluralize) { ... })(this, ...)` where
      // `this` is undefined in ESM strict mode. Replace with globalThis.
      file: 'node_modules/pluralize/pluralize.js',
      find: '})(this, function () {',
      replace:
        '})(typeof globalThis !== "undefined" ? globalThis : {}, function () {'
    },
    {
      // vinext's cookies shim only exports RequestCookies/ResponseCookies but
      // payload-auth imports parseSetCookie. Re-export from the real package.
      file: 'node_modules/vinext/dist/shims/internal/cookies.js',
      find: 'export { RequestCookies, ResponseCookies };',
      replace:
        'export { RequestCookies, ResponseCookies };\nexport { parseSetCookie } from "@edge-runtime/cookies";',
      skipIf: 'parseSetCookie'
    }
  ]
  return {
    name: 'patch-node-modules',
    enforce: 'pre',
    async config() {
      const fs = await import('node:fs/promises')
      for (const patch of patches) {
        const filePath = path.join(__dirname, patch.file)
        try {
          const content = await fs.readFile(filePath, 'utf-8')
          if (patch.skipIf && content.includes(patch.skipIf)) continue
          if (
            content.includes(typeof patch.find === 'string' ? patch.find : '')
          ) {
            await fs.writeFile(
              filePath,
              content.replace(patch.find, patch.replace)
            )
          }
        } catch {
          // File may not exist
        }
      }
    }
  }
}

/**
 * Stub native Node.js modules (sharp, etc.) for Cloudflare Workers builds.
 * These modules use native binaries that can't run in the Workers runtime.
 * Image processing is handled by the Cloudflare Images binding instead.
 */
function stubNativeModules(): Plugin {
  const stubbed = [
    'sharp',
    'pino',
    'pino-pretty',
    'console-table-printer',
    'open'
  ]
  return {
    name: 'stub-native-modules',
    enforce: 'pre',
    resolveId(source) {
      if (stubbed.includes(source)) {
        return { id: `\0stub-native:${source}`, moduleSideEffects: false }
      }
    },
    load(id) {
      if (id.startsWith('\0stub-native:')) {
        // Return an empty object (not undefined) so destructuring doesn't crash
        return 'export default {}; export const apps = {};'
      }
    }
  }
}

/**
 * Guard fileURLToPath(import.meta.url) calls for Cloudflare Workers where
 * import.meta.url may be undefined in bundled code.
 */
function fixImportMetaUrl(): Plugin {
  return {
    name: 'fix-import-meta-url',
    enforce: 'pre',
    transform(code, id) {
      if (
        id.includes('node_modules') &&
        code.includes('fileURLToPath') &&
        code.includes('import.meta.url')
      ) {
        return {
          code: code.replace(
            /fileURLToPath\(import\.meta\.url\)/g,
            '(typeof import.meta.url === "string" && import.meta.url.startsWith("file:") ? fileURLToPath(import.meta.url) : "/")'
          ),
          map: null
        }
      }
    }
  }
}

export default defineConfig(({ mode }) => ({
  define: {
    // Provide __dirname fallback for CJS modules running in Workers runtime
    __dirname: JSON.stringify('/'),
    // Workers runtime throws on console.createTask access — stub it out
    'console.createTask': 'undefined'
  },
  build: {
    // mapbox-gl and sheet system produce large route-isolated chunks
    chunkSizeWarningLimit: 2500
  },
  plugins: [
    fixEdgeRuntimeCookies(),
    patchNodeModules(),
    stubNativeModules(),
    ...(mode !== 'development' ? [stubPayloadScss(), fixImportMetaUrl()] : []),
    vinext(),
    cloudflare({
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] }
    })
  ],
  optimizeDeps: {
    include: [
      // CJS packages used by Payload that need Vite pre-bundling for ESM interop
      'ajv',
      'deepmerge',
      'pluralize',
      'object-to-formdata',
      'escape-html',
      'md5',
      'http-status',
      'sanitize-filename',
      'dequal',
      'path-to-regexp',
      'bson-objectid',
      '@dnd-kit/core',
      '@dnd-kit/modifiers',
      '@dnd-kit/sortable',
      'react/compiler-runtime'
    ]
  },
  resolve: {
    alias: {
      // file-type: cloudflare plugin resolves to core.js (no fileTypeFromFile).
      // Payload needs the Node entry which includes filesystem-based detection.
      'file-type': path.join(__dirname, 'node_modules/file-type/index.js'),
      // Alias pg → @neondatabase/serverless for Workers builds only.
      // @payloadcms/db-postgres uses `pg` (TCP), but Workers need WebSocket connections.
      // In development, keep standard pg for local Postgres.
      ...(mode !== 'development'
        ? { pg: path.join(__dirname, 'src/lib/pg-shim.ts') }
        : {}),
      // Payload imports next/headers.js (with .js) — must redirect to vinext shim
      'next/headers.js': path.join(vinextShimsDir, 'headers.js'),
      'next/server.js': path.join(vinextShimsDir, 'server.js'),
      'next/navigation.js': path.join(vinextShimsDir, 'navigation.js'),
      'next/cache.js': path.join(vinextShimsDir, 'cache.js'),
      // Force dev builds of react-server-dom in dev only: the SSR dep optimizer
      // picks the production CJS branch (esbuild doesn't evaluate NODE_ENV),
      // causing a dev-server/prod-client mismatch in the RSC stream.
      ...(mode === 'development'
        ? {
            '@vitejs/plugin-rsc/vendor/react-server-dom/client.edge': path.join(
              __dirname,
              'node_modules/@vitejs/plugin-rsc/dist/vendor/react-server-dom/cjs/react-server-dom-webpack-client.edge.development.js'
            )
          }
        : {})
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import']
      }
    }
  },
  environments: {
    // Exclude Payload packages from RSC dep optimization so the RSC plugin
    // can properly handle "use client" directives as client references
    // instead of evaluating them in the react-server context.
    rsc: {
      optimizeDeps: {
        exclude: ['@payloadcms/next', '@payloadcms/ui']
      }
    }
  },
  ssr: {
    // With the cloudflare vite plugin, externalized packages must still be
    // resolvable at runtime. Node.js-only packages are stubbed instead
    // (see stubNativeModules). TipTap is externalized because it's
    // client-only and causes SSR issues when bundled.
    external: [
      '@tiptap/core',
      '@tiptap/react',
      '@tiptap/pm',
      '@tiptap/starter-kit',
      '@tiptap/extension-link',
      '@tiptap/extension-placeholder'
    ],
    noExternal: [
      'payload-auth',
      'better-auth',
      '@dnd-kit/core',
      '@dnd-kit/modifiers',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      '@dnd-kit/accessibility'
    ]
  }
}))
