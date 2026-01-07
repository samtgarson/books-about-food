#!/usr/bin/env tsx

/**
 * Export Locations for Review
 *
 * This script exports all profile locations to CSV for human review.
 * For each location segment (split by ' • '), it searches Google Places and suggests matches.
 *
 * Usage:
 *   npx tsx bin/tasks/export-locations-for-review.ts [limit]
 *
 * Arguments:
 *   limit - Optional number of profiles to process (for testing)
 *
 * The CSV will contain:
 * - profile_id: Profile UUID
 * - profile_name: Profile name
 * - profile_slug: Profile slug
 * - original_location: The original location segment
 * - suggested_place_id: Google Places place_id
 * - suggested_display: Google Places description
 * - confidence: high/low based on match quality
 * - approved: Empty (to be filled by human reviewer with 'Y')
 */

import 'dotenv/config'

import prisma from '@books-about-food/database'
import { GooglePlacesGateway } from 'src/core/gateways/google-places'

const places = new GooglePlacesGateway()

type LocationMatch = {
  profileId: string
  profileName: string
  profileSlug: string
  originalLocation: string
  suggestedPlaceId: string | null
  suggestedDisplay: string | null
  confidence: 'high' | 'low' | 'none'
  approved: string
}

async function searchForLocation(locationString: string): Promise<{
  placeId: string | null
  displayText: string | null
  confidence: 'high' | 'low' | 'none'
}> {
  try {
    const results = await places.search(locationString, 'backfill-script')

    if (results.length === 0) {
      return { placeId: null, displayText: null, confidence: 'none' }
    }

    const firstResult = results[0]

    // High confidence: Single result OR first result is exact match
    const isExactMatch =
      firstResult.description.toLowerCase() === locationString.toLowerCase()
    const isSingleResult = results.length === 1

    if (isExactMatch || isSingleResult) {
      return {
        placeId: firstResult.place_id,
        displayText: firstResult.description,
        confidence: 'high'
      }
    }

    // Low confidence: Multiple results with no exact match
    return {
      placeId: firstResult.place_id,
      displayText: firstResult.description,
      confidence: 'low'
    }
  } catch (error) {
    console.error(`Error searching for "${locationString}":`, error)
    return { placeId: null, displayText: null, confidence: 'none' }
  }
}

function escapeCSV(value: string | null): string {
  if (value === null) return ''
  // Escape double quotes and wrap in quotes if contains comma, newline, or quote
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

async function main() {
  const limitArg = process.argv[2]
  const limit = limitArg ? parseInt(limitArg, 10) : undefined

  console.error('🔍 Fetching profiles with locations...')

  // Get all profiles with non-empty location strings
  const profiles = await prisma.profile.findMany({
    where: {
      location: {
        not: null,
        notIn: ['']
      },
      locations: { none: {} } // Exclude profiles that already have linked locations
    },
    select: {
      id: true,
      name: true,
      slug: true,
      location: true
    },
    orderBy: {
      name: 'asc'
    },
    take: limit
  })

  console.error(
    `✅ Found ${profiles.length} profiles with locations${limit ? ` (limited to ${limit})` : ''}`
  )

  // Build location matches
  const matches: LocationMatch[] = []
  const locationCache = new Map<
    string,
    {
      placeId: string | null
      displayText: string | null
      confidence: 'high' | 'low' | 'none'
    }
  >()

  let processed = 0
  for (const profile of profiles) {
    const locationString = profile.location!

    // Split by ' • ' to handle multiple locations
    const locationSegments = locationString
      .split(' • ')
      .map((s) => s.trim())
      .filter(Boolean)

    for (const segment of locationSegments) {
      // Check cache first to avoid redundant API calls
      let match = locationCache.get(segment)
      if (!match) {
        console.error(
          `🔎 Searching for: "${segment}" (${processed + 1}/${profiles.length})`
        )
        match = await searchForLocation(segment)
        locationCache.set(segment, match)

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      matches.push({
        profileId: profile.id,
        profileName: profile.name,
        profileSlug: profile.slug,
        originalLocation: segment,
        suggestedPlaceId: match.placeId,
        suggestedDisplay: match.displayText,
        confidence: match.confidence,
        approved: match.confidence === 'high' ? 'Y' : ''
      })
    }

    processed++
  }

  // Generate CSV
  console.error('\n📝 Generating CSV...\n')

  const headers = [
    'profile_id',
    'profile_name',
    'profile_slug',
    'original_location',
    'suggested_place_id',
    'suggested_display',
    'confidence',
    'approved'
  ]

  // Output CSV to stdout
  console.log(headers.join(','))

  matches.forEach((match) => {
    const row = [
      escapeCSV(match.profileId),
      escapeCSV(match.profileName),
      escapeCSV(match.profileSlug),
      escapeCSV(match.originalLocation),
      escapeCSV(match.suggestedPlaceId),
      escapeCSV(match.suggestedDisplay),
      escapeCSV(match.confidence),
      escapeCSV(match.approved)
    ].join(',')
    console.log(row)
  })

  console.error(`\n✅ Exported ${matches.length} location matches`)
  console.error('\nConfidence breakdown:')
  const confidenceCounts = matches.reduce(
    (acc, m) => {
      acc[m.confidence] = (acc[m.confidence] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  Object.entries(confidenceCounts)
    .sort(([a], [b]) => {
      const order = { high: 0, low: 1, none: 2 }
      return order[a as keyof typeof order] - order[b as keyof typeof order]
    })
    .forEach(([conf, count]) => {
      console.error(`  ${conf}: ${count}`)
    })

  console.error('\n📋 Next steps:')
  console.error(
    '  1. Review the CSV output (redirect to file: > location-review.csv)'
  )
  console.error('  2. For correct matches, set approved="Y"')
  console.error('  3. For incorrect matches, either:')
  console.error(
    '     - Update suggested_place_id/suggested_display with correct values'
  )
  console.error('     - Leave approved empty to skip (handle manually later)')
  console.error(
    '  4. Run: npx tsx bin/tasks/import-reviewed-locations.ts location-review.csv'
  )

  await prisma.$disconnect()
}

// eslint-disable-next-line promise/prefer-await-to-callbacks
main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
