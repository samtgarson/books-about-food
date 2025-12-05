#!/usr/bin/env tsx

/**
 * Import Reviewed Locations
 *
 * This script reads a reviewed CSV from stdin and creates/links locations to profiles.
 * Only processes rows where approved='Y'.
 *
 * Usage:
 *   cat location-review.csv | npx tsx bin/tasks/import-reviewed-locations.ts
 *   npx tsx bin/tasks/export-locations-for-review.ts | npx tsx bin/tasks/import-reviewed-locations.ts
 *
 * The CSV should contain (from export-locations-for-review.ts):
 * - profile_id: Profile UUID
 * - profile_name: Profile name (ignored)
 * - profile_slug: Profile slug (ignored)
 * - original_location: Original location segment (ignored)
 * - suggested_place_id: Google Places place_id
 * - suggested_display: Google Places description
 * - confidence: high/low/none (ignored)
 * - approved: 'Y' to process, empty/anything else to skip
 */

import 'dotenv/config'

import { findOrCreateLocation } from '@books-about-food/core/services/locations/find-or-create-location'
import prisma from '@books-about-food/database'

type CSVRow = {
  profileId: string
  profileName: string
  profileSlug: string
  originalLocation: string
  suggestedPlaceId: string
  suggestedDisplay: string
  confidence: string
  approved: string
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',')

  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values: string[] = []
    let currentValue = ''
    let insideQuotes = false

    // Parse CSV handling quoted fields
    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        if (insideQuotes && line[j + 1] === '"') {
          // Escaped quote
          currentValue += '"'
          j++
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes
        }
      } else if (char === ',' && !insideQuotes) {
        // End of field
        values.push(currentValue)
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    // Don't forget the last field
    values.push(currentValue)

    if (values.length !== headers.length) {
      console.error(
        `Warning: Row ${i + 1} has ${values.length} values but expected ${headers.length}`
      )
      continue
    }

    rows.push({
      profileId: values[0],
      profileName: values[1],
      profileSlug: values[2],
      originalLocation: values[3],
      suggestedPlaceId: values[4],
      suggestedDisplay: values[5],
      confidence: values[6],
      approved: values[7]
    })
  }

  return rows
}

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    process.stdin.on('data', (chunk) => chunks.push(chunk))
    process.stdin.on('end', () =>
      resolve(Buffer.concat(chunks).toString('utf-8'))
    )
    process.stdin.on('error', reject)
  })
}

async function main() {
  console.error('📂 Reading CSV from stdin...')

  const csvContent = await readStdin()
  const rows = parseCSV(csvContent)

  console.error(`✅ Parsed ${rows.length} rows from CSV`)

  // Filter to only approved rows
  const approvedRows = rows.filter(
    (row) => row.approved.trim().toUpperCase() === 'Y'
  )

  console.error(`✅ Found ${approvedRows.length} approved locations to import`)

  if (approvedRows.length === 0) {
    console.error('⚠️  No approved rows to process. Exiting.')
    await prisma.$disconnect()
    return
  }

  // Group by profile ID (since profiles may have multiple locations)
  const locationsByProfile = new Map<
    string,
    Array<{ placeId: string; displayText: string }>
  >()

  for (const row of approvedRows) {
    if (!row.suggestedPlaceId || !row.suggestedDisplay) {
      console.error(
        `⚠️  Skipping row for profile ${row.profileName}: missing placeId or displayText`
      )
      continue
    }

    if (!locationsByProfile.has(row.profileId)) {
      locationsByProfile.set(row.profileId, [])
    }

    locationsByProfile.get(row.profileId)!.push({
      placeId: row.suggestedPlaceId,
      displayText: row.suggestedDisplay
    })
  }

  console.error(`📍 Processing ${locationsByProfile.size} profiles...`)

  let successCount = 0
  let errorCount = 0

  for (const [profileId, locations] of Array.from(
    locationsByProfile.entries()
  )) {
    try {
      // Find or create all locations for this profile
      const locationResults = await Promise.all(
        locations.map((loc) => findOrCreateLocation.call(loc))
      )

      // Extract location IDs
      const locationIds = locationResults
        .filter((r) => r.success && r.data)
        .map((r) => r.data!.id)

      if (locationIds.length === 0) {
        console.error(`⚠️  No valid locations found for profile ${profileId}`)
        errorCount++
        continue
      }

      // Update profile with locations
      const profile = await prisma.profile.update({
        where: { id: profileId },
        data: {
          locations: {
            set: locationIds.map((id) => ({ id }))
          }
        },
        select: {
          name: true,
          slug: true,
          locations: {
            select: {
              displayText: true
            }
          }
        }
      })

      console.error(
        `✅ Updated ${profile.name} (${profile.slug}): ${profile.locations.map((l) => l.displayText).join(' • ')}`
      )
      successCount++
    } catch (error) {
      console.error(`❌ Error updating profile ${profileId}:`, error)
      errorCount++
    }
  }

  console.error(`\n✅ Import complete!`)
  console.error(`   Success: ${successCount} profiles`)
  console.error(`   Errors: ${errorCount} profiles`)

  await prisma.$disconnect()
}

// eslint-disable-next-line promise/prefer-await-to-callbacks
main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
