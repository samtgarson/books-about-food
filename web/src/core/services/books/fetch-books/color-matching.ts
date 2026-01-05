import { SQL, sql } from '@payloadcms/db-postgres/drizzle'
import { books_palette } from 'src/payload/schema'
import { NamedColor, OddColors } from '../colors'

/** Gets relative radius for a hue considering visual perception of breadth of color */
export function hueRadius(h: number) {
  if (h < 10) return 20 // red to orange
  if (h < 85) return 12 // orange to yellow
  if (h < 170) return 20 // yellow to green
  if (h < 215) return 12 // green to cyan
  if (h < 280) return 20 // cyan to blue
  return 12
}

export function namedColorQuery(color: NamedColor) {
  switch (color) {
    case NamedColor.white:
      return sql`(${books_palette.color} ->> 'l')::decimal > 90`
    case NamedColor.black:
      return sql`(${books_palette.color} ->> 'l')::decimal < 10`
    case NamedColor.brown:
      return sql`(${books_palette.color} ->> 'h')::decimal between 10 and 35
      and (${books_palette.color} ->> 's')::decimal > 35
      and (${books_palette.color} ->> 'l')::decimal between 8 and 40`
    case NamedColor.gray:
      return sql`(${books_palette.color} ->> 's')::decimal < 15
      and (${books_palette.color} ->> 'l')::decimal between 25 and 70`
    default:
      return sql`(${sql.raw(namedColorToHueBand(color).map(hueBoundToSql).join(' or '))})
      and (${books_palette.color} ->> 's')::decimal > 40
      and (${books_palette.color} ->> 'l')::decimal between 20 and 70`
  }
}

function hueBoundToSql([lower, upper]: [number, number]) {
  // Note: Used within sql.raw() context, so must return plain string
  // The "color" column reference works in the subquery context
  return `("color" ->> 'h')::decimal between ${lower} and ${upper}`
}

function namedColorToHueBand(
  color: Exclude<NamedColor, OddColors>
): [number, number][] {
  switch (color) {
    case NamedColor.red:
      return [
        [0, 10],
        [331, 360]
      ]
    case NamedColor.orange:
      return [[11, 35]]
    case NamedColor.yellow:
      return [[36, 70]]
    case NamedColor.lime:
      return [[71, 105]]
    case NamedColor.green:
      return [[106, 145]]
    case NamedColor.cyan:
      return [[146, 195]]
    case NamedColor.blue:
      return [[196, 240]]
    case NamedColor.purple:
      return [[241, 280]]
    case NamedColor.pink:
      return [[281, 330]]
  }
}

/**
 * Generate color match SQL for filtering and scoring
 * Returns SQL condition that matches palette colors against the target color
 */
export function colorMatchCondition(color: NamedColor | number[]): SQL {
  // If it's a named color, use the predefined query
  if (typeof color === 'string') return namedColorQuery(color)

  // For HSL array [h, s, l], calculate distance
  const [targetH, targetS, targetL] = color
  const radius = hueRadius(targetH)

  // Calculate hue distance with wraparound
  // Use LEAST to get minimum distance considering wraparound at 360
  return sql`
    LEAST(
      ABS((${books_palette.color} ->> 'h')::decimal - ${targetH}),
      360 - ABS((${books_palette.color} ->> 'h')::decimal - ${targetH})
    ) <= ${radius}
    AND ABS((${books_palette.color} ->> 's')::decimal - ${targetS}) <= 35
    AND ABS((${books_palette.color} ->> 'l')::decimal - ${targetL}) <= 35
  `
}

/**
 * Generate color match score SQL
 * Higher score = better match (inverse distance formula: 1.0 / (1.0 + distance²))
 */
export function colorMatchScore(color: NamedColor | number[]): SQL {
  // For named colors, return 1 if match, 0 if not (binary)
  if (typeof color === 'string') {
    return sql`CASE WHEN ${namedColorQuery(color)} THEN 1 ELSE 0 END`
  }

  // For HSL array, calculate distance (lower = better match)
  const [targetH, targetS, targetL] = color
  return sql`
    1.0 / (1.0 +
      POWER(LEAST(
        ABS((${books_palette.color} ->> 'h')::decimal - ${targetH}),
        360 - ABS((${books_palette.color} ->> 'h')::decimal - ${targetH})
      ), 2) +
      POWER(ABS((${books_palette.color} ->> 's')::decimal - ${targetS}), 2) / 100.0 +
      POWER(ABS((${books_palette.color} ->> 'l')::decimal - ${targetL}), 2) / 100.0
    )
  `
}
