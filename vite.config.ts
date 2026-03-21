import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import vinext from 'vinext'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { defineConfig, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vinextShimsDir = path.join(__dirname, 'node_modules/vinext/dist/shims')

/**
 * Workaround for vinext server action tree re-render loop.
 *
 * After every server action, vinext re-renders the full page tree.
 * This causes Payload's Form component to receive a new initialState
 * reference -> useEffect fires -> REPLACE_STATE resets the form ->
 * onChange fires another server action -> infinite loop.
 *
 * Fix: skip root re-render when the action returned data successfully.
 */
function fixServerActionRerender(): Plugin {
  return {
    name: 'fix-server-action-rerender',
    enforce: 'post',
    transform(code, id) {
      if (
        !id.includes('vinext-app-browser-entry') &&
        !code.includes('setServerCallback')
      )
        return

      const original = [
        '  if (result && typeof result === "object" && "root" in result) {',
        '    reactRoot.render(result.root);',
        "    // Return the action's return value to the caller",
        '    if (result.returnValue) {',
        '      if (!result.returnValue.ok) throw result.returnValue.data;',
        '      return result.returnValue.data;',
        '    }',
        '    return undefined;',
        '  }'
      ].join('\n')

      const replacement = [
        '  if (result && typeof result === "object" && "root" in result) {',
        '    if (result.returnValue) {',
        '      // Has return value — skip root re-render to preserve client state.',
        '      if (!result.returnValue.ok) throw result.returnValue.data;',
        '      return result.returnValue.data;',
        '    }',
        '    // Void action (mutation) — re-render page with updated tree.',
        '    reactRoot.render(result.root);',
        '    return undefined;',
        '  }'
      ].join('\n')

      if (code.includes(original)) {
        return { code: code.replace(original, replacement), map: null }
      }
    }
  }
}

/**
 * Workaround for @vitejs/plugin-rsc server action hoisting bug.
 *
 * When RSC hoists a server action with bound args, it creates
 * const [x, y] = decrypt(...). If the body also declares const y = ...,
 * you get "Identifier 'y' has already been declared".
 *
 * In @payloadcms/next Root layout, switchLanguageServerAction binds
 * config and cookies, then the body declares const cookies = await nextCookies().
 */
function fixRscHoistCollision(): Plugin {
  return {
    name: 'fix-rsc-hoist-collision',
    enforce: 'post',
    transform(code, id) {
      if (!id.includes('@payloadcms')) return

      if (
        code.includes('decryptActionBoundArgs') &&
        code.includes('nextCookies')
      ) {
        let modified = code.replace(
          /(decryptActionBoundArgs\(.*?\);[\s\S]*?)'use server';\s*\n\s*const cookies = await nextCookies\(\)/g,
          "$1'use server';\n    const __local_cookies = await nextCookies()"
        )
        if (modified !== code) {
          modified = modified.replace(
            /__local_cookies = await nextCookies\(\);\s*\n\s*cookies\.set\(/,
            '__local_cookies = await nextCookies();\n    __local_cookies.set('
          )
          return { code: modified, map: null }
        }
      }
    }
  }
}

/**
 * Resolve extensionless ESM imports in payload-authjs.
 * Its dist files use imports like "../authjs/getAuthjsInstance" without .js.
 * Node's ESM resolver requires explicit extensions, so we append .js.
 */
function fixPayloadAuthjsResolve(): Plugin {
  return {
    name: 'fix-payload-authjs-resolve',
    enforce: 'pre',
    resolveId(source, importer) {
      if (
        importer &&
        importer.includes('payload-authjs') &&
        !source.startsWith('\0') &&
        !path.extname(source) &&
        source.startsWith('.')
      ) {
        const base = path.resolve(path.dirname(importer), source)
        // Try .js extension
        if (existsSync(base + '.js')) return base + '.js'
        // Try directory import (index.js)
        const indexPath = path.join(base, 'index.js')
        if (existsSync(indexPath)) return indexPath
      }
    }
  }
}

/**
 * Fix Suspense boundaries not resolving during client-side navigation.
 *
 * vinext uses flushSync for navigation renders to ensure the DOM is updated
 * before scrolling. But flushSync with Suspense causes boundaries to get
 * stuck in the fallback state — React commits the fallback synchronously
 * but doesn't properly retry when the suspended promise resolves.
 *
 * Fix: use startTransition for the render (like Next.js does), then await
 * a microtask before returning so the scroll-to-top still works.
 */
function fixNavigationSuspense(): Plugin {
  return {
    name: 'fix-navigation-suspense',
    enforce: 'post',
    transform(code, id) {
      if (
        !id.includes('vinext-app-browser-entry') &&
        !code.includes('__VINEXT_RSC_NAVIGATE__')
      )
        return

      // Replace the flushSync navigation render with startTransition
      const original =
        '      const rscPayload = await createFromFetch(Promise.resolve(navResponse));\n' +
        '      // Use flushSync to guarantee React commits the new tree to the DOM\n' +
        '      // synchronously before this function returns. Callers scroll to top\n' +
        '      // after awaiting, so the new content must be painted first.\n' +
        '      flushSync(function () { reactRoot.render(rscPayload); });'

      const replacement =
        '      const rscPayload = await createFromFetch(Promise.resolve(navResponse));\n' +
        '      // Use startTransition instead of flushSync so Suspense boundaries\n' +
        '      // can properly resolve async content after navigation.\n' +
        '      __startTransition(function () { reactRoot.render(rscPayload); });\n' +
        '      // Yield to let React commit before callers scroll to top.\n' +
        '      await new Promise(function (r) { setTimeout(r, 0); });'

      if (code.includes(original)) {
        // Add ReactDOM import if not already present
        let modified = code.replace(original, replacement)
        if (!modified.includes('startTransition')) {
          // startTransition is already in the replacement string, so this
          // branch shouldn't fire, but just in case:
        }
        if (
          !modified.includes('import { startTransition }') &&
          !modified.includes('__startTransition')
        ) {
          modified = modified.replace(
            'import { hydrateRoot } from "react-dom/client";',
            'import { hydrateRoot } from "react-dom/client";\nimport { startTransition as __startTransition } from "react";'
          )
        }
        return { code: modified, map: null }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vinext(),
    fixServerActionRerender(),
    fixNavigationSuspense(),
    fixRscHoistCollision(),
    fixPayloadAuthjsResolve()
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
      // Payload imports next/headers.js (with .js) — must redirect to vinext shim
      'next/headers.js': path.join(vinextShimsDir, 'headers.js'),
      'next/server.js': path.join(vinextShimsDir, 'server.js'),
      'next/navigation.js': path.join(vinextShimsDir, 'navigation.js'),
      'next/cache.js': path.join(vinextShimsDir, 'cache.js'),
      // Force dev builds of react-server-dom: the SSR dep optimizer picks the
      // production CJS branch (esbuild doesn't evaluate NODE_ENV conditionals),
      // causing a dev-server/prod-client mismatch in the RSC stream.
      '@vitejs/plugin-rsc/vendor/react-server-dom/client.edge': path.join(
        __dirname,
        'node_modules/@vitejs/plugin-rsc/dist/vendor/react-server-dom/cjs/react-server-dom-webpack-client.edge.development.js'
      )
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import']
      }
    }
  },
  ssr: {
    external: [
      'payload',
      'payload/shared',
      '@payloadcms/db-postgres',
      '@payloadcms/graphql',
      '@payloadcms/richtext-lexical',
      '@payloadcms/storage-s3',
      '@payloadcms/translations',
      'sharp',
      'drizzle-kit',
      'drizzle-orm',
      'graphql',
      'pino',
      'pino-pretty',
      'console-table-printer',
      'pluralize',
      'open',
      '@vercel/functions',
      '@vibrant/color',
      '@vibrant/core',
      '@vibrant/quantizer-mmcq',
      '@tiptap/core',
      '@tiptap/react',
      '@tiptap/pm',
      '@tiptap/starter-kit',
      '@tiptap/extension-link',
      '@tiptap/extension-placeholder'
    ],
    noExternal: [
      '@payloadcms/next',
      '@payloadcms/ui',
      'payload-authjs',
      '@dnd-kit/core',
      '@dnd-kit/modifiers',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      '@dnd-kit/accessibility'
    ]
  }
})
