/**
 * Utility functions for validating Payload relationships are populated.
 *
 * When querying Payload with depth, relationships can be either:
 * - string (ID only - not populated)
 * - Object (populated relationship)
 *
 * These utilities throw clear errors when required relationships aren't populated.
 */

/**
 * Validates a single optional relationship is populated if present.
 * Throws if the value is a string ID instead of a populated object.
 *
 * @param value - The relationship field value
 * @param fieldName - Name of the field for error messages (e.g., "Profile.avatar")
 * @returns The populated object or undefined
 */
export function optionalPopulated<T>(
  value: T | string | null | undefined,
  fieldName: string
): T | undefined {
  if (value && typeof value === 'string') {
    throw new Error(
      `${fieldName} must be populated (string ID received). Ensure sufficient depth when querying.`
    )
  }
  return value as T | undefined
}

/**
 * Validates a required relationship is populated.
 * Throws if the value is a string ID, null, or undefined.
 *
 * @param value - The relationship field value
 * @param fieldName - Name of the field for error messages (e.g., "Membership.user")
 * @returns The populated object
 */
export function requirePopulated<T>(
  value: T | string | null | undefined,
  fieldName: string
): T {
  if (!value || typeof value === 'string') {
    throw new Error(
      `${fieldName} must be populated (string ID received). Ensure sufficient depth when querying.`
    )
  }
  return value as T
}

/**
 * Validates an array of relationships are populated.
 * Throws if any items are string IDs instead of populated objects.
 * Filters out any string IDs that slip through.
 *
 * @param values - The relationship array
 * @param fieldName - Name of the field for error messages (e.g., "Book.authors")
 * @returns Array of populated objects
 */
export function requirePopulatedArray<T>(
  values: (T | string)[] | null | undefined,
  fieldName: string
): T[] {
  if (values?.some((v) => typeof v === 'string')) {
    throw new Error(
      `${fieldName} must be populated (string IDs received). Ensure sufficient depth when querying.`
    )
  }
  return (values ?? []).filter((v): v is T => typeof v !== 'string')
}

/**
 * Validates an optional array of relationships.
 * If present, all items must be populated objects.
 *
 * @param values - The relationship array
 * @param fieldName - Name of the field for error messages
 * @returns Array of populated objects or empty array
 */
export function optionalPopulatedArray<T>(
  values: (T | string)[] | null | undefined,
  fieldName: string
): T[] {
  if (values?.some((v) => typeof v === 'string')) {
    throw new Error(
      `${fieldName} must be populated (string IDs received). Ensure sufficient depth when querying.`
    )
  }
  return (values ?? []).filter((v): v is T => typeof v !== 'string')
}

/**
 * Extracts ID from a relationship that might be a string or object.
 * Useful for optional relationships where you just need the ID.
 *
 * @param value - The relationship value
 * @returns The ID string or undefined
 */
export function extractId(
  value: { id: string } | string | null | undefined
): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : value.id
}

/** * Extracts IDs from an array of relationships that might be strings or objects.
 *
 * @param values - The relationship array
 * @returns Array of ID strings
 */
export function extractIds(
  values: ({ id: string } | string)[] | null | undefined
): string[] {
  if (!values) return []
  return values.map((v) => (typeof v === 'string' ? v : v.id))
}
