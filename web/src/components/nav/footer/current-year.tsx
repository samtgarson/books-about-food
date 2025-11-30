'use client'

// MIGRATED: Extracted to client component to handle new Date().getFullYear()
// Cache Components: new Date() requires either client component or connection() call
// This small client component keeps the Footer as a server component

export function CurrentYear() {
  return <>{new Date().getFullYear()}</>
}
