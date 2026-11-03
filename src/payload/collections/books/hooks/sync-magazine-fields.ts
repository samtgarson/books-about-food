import type { CollectionBeforeChangeHook } from 'payload'
import type { Book } from 'src/payload/payload-types'

/**
 * Keeps the magazine fields in sync with the book type:
 * - books created with a magazine (e.g. from a magazine's issues list) are
 *   saved as magazine issues
 * - books switched back to a cookbook have their magazine fields cleared
 */
export const syncMagazineFields: CollectionBeforeChangeHook<Book> = ({
  data,
  operation,
  originalDoc
}) => {
  if (operation === 'create' && data.magazine) {
    return { ...data, type: 'magazineIssue' }
  }

  // Partial updates may not include the type, so fall back to the stored one
  const type = data.type ?? originalDoc?.type
  if (type === 'magazineIssue') return data

  return { ...data, magazine: null, issueNumber: null, issueLabel: null }
}
