import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
import path from 'node:path'

// Map next/* imports to vinext shim files
const VINEXT_SHIMS_DIR = new URL(
  './node_modules/vinext/dist/shims/',
  import.meta.url
).pathname

const NEXT_SHIM_MAP = {
  'next/headers': 'headers.js',
  'next/server': 'server.js',
  'next/navigation': 'navigation.js',
  'next/cache': 'cache.js',
  'next/image': 'image.js',
  'next/link': 'link.js',
  'next/dynamic': 'dynamic.js',
  'next/head': 'head.js',
  'next/script': 'script.js',
  'next/config': 'config.js',
  'next/router': 'router.js',
  'next/error': 'error.js',
  'next/document': 'document.js',
  'next/constants': 'constants.js',
  'next/og': 'og.js',
  'next/form': 'form.js',
  'next/headers.js': 'headers.js',
  'next/server.js': 'server.js',
  'next/navigation.js': 'navigation.js',
  'next/cache.js': 'cache.js',
}

/**
 * Node.js ESM loader hooks:
 * 1. Resolve extensionless relative imports to .js (for packages like payload-auth)
 * 2. Redirect next/* imports globally to vinext shims
 * 3. Stub .css/.scss imports (Node can't process them)
 */
export function resolve(specifier, context, nextResolve) {
  // Handle extensionless relative imports from payload-auth
  if (
    context.parentURL &&
    context.parentURL.includes('payload-auth') &&
    specifier.startsWith('.') &&
    !path.extname(specifier)
  ) {
    const parentPath = new URL(context.parentURL).pathname
    const base = path.resolve(path.dirname(parentPath), specifier)
    // Try .js extension first
    if (existsSync(base + '.js')) {
      return { url: pathToFileURL(base + '.js').href, shortCircuit: true }
    }
    // Try directory import (index.js)
    const indexPath = path.join(base, 'index.js')
    if (existsSync(indexPath)) {
      return { url: pathToFileURL(indexPath).href, shortCircuit: true }
    }
  }

  // Redirect next/* imports to vinext shims globally
  const shimFile = NEXT_SHIM_MAP[specifier]
  if (shimFile) {
    const shimPath = path.join(VINEXT_SHIMS_DIR, shimFile)
    if (existsSync(shimPath)) {
      return { url: pathToFileURL(shimPath).href, shortCircuit: true }
    }
  }

  return nextResolve(specifier, context)
}

const STUB_EXTENSIONS = ['.css', '.scss', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.woff', '.woff2', '.ttf', '.eot']

export function load(url, context, nextLoad) {
  if (STUB_EXTENSIONS.some(ext => url.endsWith(ext))) {
    return { format: 'module', source: 'export default ""', shortCircuit: true }
  }
  return nextLoad(url, context)
}
