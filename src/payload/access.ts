import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

/**
 * Access control for Payload's REST and GraphQL APIs.
 *
 * These mirror the website's policies in `src/core/policies`. The website
 * itself reads and writes through the Local API, which skips access control,
 * so these rules only govern requests made over HTTP (`/api/*`).
 */

export function isAdmin(req: PayloadRequest) {
  const role = req.user?.role
  const roles: unknown[] = Array.isArray(role) ? role : [role]
  return roles.includes('admin')
}

/**
 * IDs of the publishers the current user is a member of, looked up once per
 * request.
 */
export async function memberPublisherIds(req: PayloadRequest) {
  if (!req.user) return []
  if (Array.isArray(req.context.memberPublisherIds)) {
    return req.context.memberPublisherIds as string[]
  }

  const { docs } = await req.payload.find({
    collection: 'memberships',
    where: { user: { equals: req.user.id } },
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req
  })
  const ids = docs.map(function (membership) {
    return typeof membership.publisher === 'string'
      ? membership.publisher
      : membership.publisher.id
  })
  req.context.memberPublisherIds = ids
  return ids
}

async function memberPublisherConditions(req: PayloadRequest) {
  const publisherIds = await memberPublisherIds(req)
  if (!publisherIds.length) return []
  return [{ publisher: { in: publisherIds } }]
}

/** Combines conditions, denying access when there are none. */
function anyOf(conditions: Where[]) {
  if (!conditions.length) return false
  return { or: conditions }
}

export const anyone: Access = function () {
  return true
}

export const adminOnly: Access = function ({ req }) {
  return isAdmin(req)
}

/** Admins see everything; other users see documents linked to them. */
export function ownedBy(field: string): Access {
  return function ({ req }) {
    if (isAdmin(req)) return true
    if (!req.user) return false
    return { [field]: { equals: req.user.id } }
  }
}

/**
 * Admins see everything; everyone sees published documents; publisher members
 * also see their publisher's documents, plus any extra conditions given for
 * the current user.
 */
export function publishedOrOwned(
  extra: (userId: string) => Where[] = () => []
): Access {
  return async function ({ req }) {
    if (isAdmin(req)) return true
    const published: Where = { status: { equals: 'published' } }
    if (!req.user) return published

    return {
      or: [
        published,
        ...(await memberPublisherConditions(req)),
        ...extra(req.user.id)
      ]
    }
  }
}

/** Admins can edit anything; publisher members can edit their publisher's documents. */
export function editableByPublisher(
  extra: (userId: string) => Where[] = () => []
): Access {
  return async function ({ req }) {
    if (isAdmin(req)) return true
    if (!req.user) return false

    return anyOf([
      ...(await memberPublisherConditions(req)),
      ...extra(req.user.id)
    ])
  }
}

/** Admins can edit any publisher; members can edit their own publishers. */
export const publisherMember: Access = async function ({ req }) {
  if (isAdmin(req)) return true
  const publisherIds = await memberPublisherIds(req)
  if (!publisherIds.length) return false
  return { id: { in: publisherIds } }
}

/** Admins and members of the publisher, for fields on a publisher document. */
export const publisherMemberField: FieldAccess = async function ({ req, doc }) {
  if (isAdmin(req)) return true
  if (!req.user || !doc?.id) return false
  const publisherIds = await memberPublisherIds(req)
  return publisherIds.includes(doc.id)
}

/**
 * Only admins can publish, or change a document that is already published
 * back to draft. Anyone who can edit the document can move it between draft
 * and in review.
 */
export const canChangeStatus: FieldAccess = function ({ req, data, doc }) {
  if (isAdmin(req)) return true
  return doc?.status !== 'published' && data?.status !== 'published'
}
