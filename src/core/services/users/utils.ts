import { extractId } from 'src/core/models/utils/payload-validation'
import { UserRole } from 'src/core/types'
import type { Membership } from 'src/payload/payload-types'

export function extractRole(
  role: UserRole | UserRole[] | null | undefined
): UserRole {
  if (Array.isArray(role)) return role[0] ?? 'user'
  return role ?? 'user'
}

export function extractMemberships(
  docs: (string | Membership)[] | null | undefined
): string[] {
  if (!docs) return []

  return docs.flatMap(function (membership) {
    if (typeof membership === 'string') return []
    return extractId(membership.publisher) ?? []
  })
}
