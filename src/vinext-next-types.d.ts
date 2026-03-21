// Stub for Next.js generated route types that don't exist under vinext.
// Next.js generates .next/types/routes with typed route strings; vinext
// doesn't have this codegen, so we fall back to plain strings.
declare module '.next/types/routes' {
  type AppRoutes = string
}

// Next.js generates PageProps as a global type. Without codegen we provide
// a loose fallback so existing page components type-check.
type PageProps<_Route extends string = string> = {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
