import { z } from 'zod'
import { Service } from '../base'

export type LocationFilterOption = {
  id: string
  value: string
}

export const fetchLocationFilterOptions = new Service(
  z.object({}),
  async function (_input, { payload }) {
    const { docs: locations } = await payload.find({
      collection: 'locations',
      limit: 0,
      depth: 0
    })

    // Map keyed by display value - first entry wins (countries, then regions, then locations)
    const optionsMap = new Map<string, LocationFilterOption>()

    for (const loc of locations) {
      // Add country option (loosest)
      if (loc.country && !optionsMap.has(loc.country)) {
        optionsMap.set(loc.country, {
          id: `country:${loc.country}`,
          value: loc.country
        })
      }

      // Add region option
      if (loc.region && loc.country) {
        const regionKey = `${loc.region}, ${loc.country}`
        if (!optionsMap.has(regionKey)) {
          optionsMap.set(regionKey, {
            id: `region:${loc.region}`,
            value: regionKey
          })
        }
      }

      // Add specific location (most specific - only if not already covered)
      if (!optionsMap.has(loc.displayText)) {
        optionsMap.set(loc.displayText, {
          id: loc.slug,
          value: loc.displayText
        })
      }
    }

    // Sort alphabetically by value
    return [...optionsMap.values()].sort((a, b) =>
      a.value.localeCompare(b.value)
    )
  }
)
