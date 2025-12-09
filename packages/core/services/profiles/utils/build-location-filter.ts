import { Prisma } from '@books-about-food/database'

export function buildLocationFilter(
  locations: string[]
): Prisma.ProfileWhereInput | null {
  if (!locations || locations.length === 0) return null

  // Separate slugs from composite filters
  const slugFilters: string[] = []
  const compositeFilters: Array<{ type: string; value: string }> = []

  for (const filter of locations) {
    if (filter.includes(':')) {
      const [type, value] = filter.split(':', 2)
      compositeFilters.push({ type, value })
    } else {
      // Slug format
      slugFilters.push(filter)
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

  // Slug-based filtering (cities)
  if (slugFilters.length > 0) {
    locationConditions.push({
      locations: {
        some: { slug: { in: slugFilters } }
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
