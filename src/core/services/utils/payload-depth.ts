/**
 * Payload depth configuration values
 *
 * These depth values correspond to the Prisma include patterns defined in includes.ts.
 * Payload's depth parameter controls how many levels of relationships to populate.
 *
 * Mapping:
 * - locationIncludes → LOCATION_DEPTH (1)
 * - profileIncludes → PROFILE_DEPTH (2: includes locations)
 * - publisherIncludes → PUBLISHER_DEPTH (2: includes imprints/house)
 * - bookIncludes → BOOK_DEPTH (3: includes authors/contributions with profiles)
 * - fullBookIncludes → FULL_BOOK_DEPTH (3: same depth as bookIncludes)
 * - membershipIncludes → MEMBERSHIP_DEPTH (1: includes user)
 * - invitationIncludes → INVITATION_DEPTH (1: includes invitedBy)
 * - collectionIncludes → COLLECTION_DEPTH (4: includes items > book > full relations)
 * - tagGroupIncludes → TAG_GROUP_DEPTH (1: includes tags array)
 */

export const LOCATION_DEPTH = 1
export const PROFILE_DEPTH = 1
export const PUBLISHER_DEPTH = 2
export const BOOK_DEPTH = 3
export const FULL_BOOK_DEPTH = 3
export const MEMBERSHIP_DEPTH = 1
export const INVITATION_DEPTH = 1
export const COLLECTION_DEPTH = 4
export const TAG_GROUP_DEPTH = 1
