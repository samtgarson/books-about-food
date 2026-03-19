import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vinext from "vinext"
import { defineConfig, type Plugin } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vinextShimsDir = path.join(__dirname, "node_modules/vinext/dist/shims")

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
    name: "fix-server-action-rerender",
    enforce: "post",
    transform(code, id) {
      if (
        !id.includes("vinext-app-browser-entry") &&
        !code.includes("setServerCallback")
      )
        return

      const original = [
        '  if (result && typeof result === "object" && "root" in result) {',
        "    reactRoot.render(result.root);",
        "    // Return the action's return value to the caller",
        "    if (result.returnValue) {",
        "      if (!result.returnValue.ok) throw result.returnValue.data;",
        "      return result.returnValue.data;",
        "    }",
        "    return undefined;",
        "  }",
      ].join("\n")

      const replacement = [
        '  if (result && typeof result === "object" && "root" in result) {',
        "    if (result.returnValue) {",
        "      // Has return value — skip root re-render to preserve client state.",
        "      if (!result.returnValue.ok) throw result.returnValue.data;",
        "      return result.returnValue.data;",
        "    }",
        "    // Void action (mutation) — re-render page with updated tree.",
        "    reactRoot.render(result.root);",
        "    return undefined;",
        "  }",
      ].join("\n")

      if (code.includes(original)) {
        return { code: code.replace(original, replacement), map: null }
      }
    },
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
    name: "fix-rsc-hoist-collision",
    enforce: "post",
    transform(code, id) {
      if (!id.includes("@payloadcms")) return

      if (
        code.includes("decryptActionBoundArgs") &&
        code.includes("nextCookies")
      ) {
        let modified = code.replace(
          /(decryptActionBoundArgs\(.*?\);[\s\S]*?)'use server';\s*\n\s*const cookies = await nextCookies\(\)/g,
          "$1'use server';\n    const __local_cookies = await nextCookies()"
        )
        if (modified !== code) {
          modified = modified.replace(
            /__local_cookies = await nextCookies\(\);\s*\n\s*cookies\.set\(/,
            "__local_cookies = await nextCookies();\n    __local_cookies.set("
          )
          return { code: modified, map: null }
        }
      }
    },
  }
}

/**
 * Resolve extensionless ESM imports in payload-authjs.
 * Its dist files use imports like "../authjs/getAuthjsInstance" without .js.
 * Node's ESM resolver requires explicit extensions, so we append .js.
 */
function fixPayloadAuthjsResolve(): Plugin {
  return {
    name: "fix-payload-authjs-resolve",
    enforce: "pre",
    resolveId(source, importer) {
      if (
        importer &&
        importer.includes("payload-authjs") &&
        !source.startsWith("\0") &&
        !path.extname(source) &&
        source.startsWith(".")
      ) {
        const base = path.resolve(path.dirname(importer), source)
        // Try .js extension
        if (existsSync(base + ".js")) return base + ".js"
        // Try directory import (index.js)
        const indexPath = path.join(base, "index.js")
        if (existsSync(indexPath)) return indexPath
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vinext(),
    fixServerActionRerender(),
    fixRscHoistCollision(),
    fixPayloadAuthjsResolve(),
  ],
  optimizeDeps: {
    include: [
      // CJS packages used by Payload that need Vite pre-bundling for ESM interop
      "ajv",
      "deepmerge",
      "pluralize",
      "object-to-formdata",
      "escape-html",
      "md5",
      "http-status",
      "sanitize-filename",
      "dequal",
      "path-to-regexp",
      "bson-objectid",
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "react/compiler-runtime",
    ],
  },
  resolve: {
    alias: {
      // Payload imports next/headers.js (with .js) — must redirect to vinext shim
      "next/headers.js": path.join(vinextShimsDir, "headers.js"),
      "next/server.js": path.join(vinextShimsDir, "server.js"),
      "next/navigation.js": path.join(vinextShimsDir, "navigation.js"),
      "next/cache.js": path.join(vinextShimsDir, "cache.js"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import"],
      },
    },
  },
  ssr: {
    external: [
      "payload",
      "payload/shared",
      "@payloadcms/db-postgres",
      "@payloadcms/graphql",
      "@payloadcms/richtext-lexical",
      "@payloadcms/storage-s3",
      "@payloadcms/translations",
      "sharp",
      "drizzle-kit",
      "drizzle-orm",
      "graphql",
      "pino",
      "pino-pretty",
      "console-table-printer",
      "pluralize",
      "open",
      "@vercel/functions",
      "@vercel/speed-insights",
      /^@vibrant\//,
    ],
    noExternal: [
      "@payloadcms/next",
      "@payloadcms/ui",
      "payload-authjs",
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@dnd-kit/accessibility",
    ],
  },
})
