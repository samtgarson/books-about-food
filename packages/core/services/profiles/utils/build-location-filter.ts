import { Prisma } from '@books-about-food/database'

type LocationFilter = string // UUID or "type:value"

export function buildLocationFilter(
  locationIds: LocationFilter[]
): Prisma.ProfileWhereInput | null {
  if (!locationIds || locationIds.length === 0) return null

  // Separate UUIDs from composite filters
  const uuidFilters: string[] = []
  const compositeFilters: Array<{ type: string; value: string }> = []

  for (const id of locationIds) {
    if (id.includes(':')) {
      const [type, value] = id.split(':', 2)
      compositeFilters.push({ type, value })
    } else {
      // UUID format
      uuidFilters.push(id)
    }
  }

  // Group composite filters by type
  const byType = {
    region: compositeFilters
      .filter((f) => f.type === 'region')
      .map((f) => f.value),
    country: compositeFilters
      .filter((f) => f.type === 'country')
      .map((f) => f.value)
  }

  // Build OR conditions
  const locationConditions: Prisma.ProfileWhereInput[] = []

  // UUID-based filtering (cities + backward compatibility)
  // Cities now pass their actual location UUID from the view's location_id column
  if (uuidFilters.length > 0) {
    locationConditions.push({
      locations: {
        some: { id: { in: uuidFilters } }
      }
    })
  }

  // Region filtering
  if (byType.region.length > 0) {
    locationConditions.push({
      locations: {
        some: { region: { in: byType.region } }
      }
    })
  }

  // Country filtering
  if (byType.country.length > 0) {
    locationConditions.push({
      locations: {
        some: { country: { in: byType.country } }
      }
    })
  }

  // Return null if no conditions
  if (locationConditions.length === 0) return null

  // Single condition - return directly
  if (locationConditions.length === 1) {
    return locationConditions[0]
  }

  // Multiple conditions - combine with OR
  return { OR: locationConditions }
}
