/**
 * Recursively transforms all keys in an object using the provided transformation function
 * @param obj The object to transform
 * @param transformFn A function that takes a key and returns the transformed key
 * @returns A new object with transformed keys
 */
export function transformKeys<T = unknown>(
  obj: unknown,
  transformFn: (key: string) => string
): T {
  // Handle null or undefined
  if (obj === null || obj === undefined) {
    return obj as T
  }

  // Handle primitive types and dates (not objects)
  if (typeof obj !== 'object' || obj instanceof Date) {
    return obj as T
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transformFn)) as T
  }

  // Handle objects
  return Object.entries(obj).reduce((result, [key, value]) => {
    const transformedKey = transformFn(key)
    const transformedValue = transformKeys(value, transformFn)

    return {
      ...result,
      [transformedKey]: transformedValue
    }
  }, {}) as T
}
