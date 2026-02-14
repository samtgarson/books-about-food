import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Config,
  Plugin
} from 'payload'

type RevalidatePathsFn = (doc: Record<string, unknown>) => string[]

/**
 * Utility for creating a typed revalidatePaths function that collections can
 * use in their custom config.
 */
export function revalidatePaths(
  fn: (doc: Record<string, unknown>) => string[]
): RevalidatePathsFn {
  return fn
}

/**
 * Cache Revalidation Plugin
 *
 * Automatically adds afterChange and afterDelete hooks to collections
 * that define a `revalidatePaths` function in their `custom` config.
 *
 * Usage in collection config:
 * ```ts
 * {
 *   slug: 'books',
 *   custom: {
 *     revalidatePaths: (doc) => [`/cookbooks/${doc.slug}`, '/cookbooks', '/']
 *   },
 *   // ... rest of config
 * }
 * ```
 */
export function cacheRevalidationPlugin(): Plugin {
  return (incomingConfig: Config): Config => {
    const collections = (incomingConfig.collections || []).map((collection) => {
      const revalidatePaths = collection.custom
        ?.revalidatePaths as RevalidatePathsFn

      if (!revalidatePaths) {
        return collection
      }

      const afterChangeHook: CollectionAfterChangeHook = async ({ doc }) => {
        const paths = revalidatePaths(doc)
        for (const path of paths) {
          revalidatePath(path)
        }
        return doc
      }

      const afterDeleteHook: CollectionAfterDeleteHook = async ({ doc }) => {
        const paths = revalidatePaths(doc)
        for (const path of paths) {
          revalidatePath(path)
        }
        return doc
      }

      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...(collection.hooks?.afterChange || []),
            afterChangeHook
          ],
          afterDelete: [
            ...(collection.hooks?.afterDelete || []),
            afterDeleteHook
          ]
        }
      }
    })

    return {
      ...incomingConfig,
      collections
    }
  }
}
