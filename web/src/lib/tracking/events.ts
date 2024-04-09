export type TrackableEvents = {
  'Opened a modal': { Extra?: Record<string, unknown>; Modal: string }
  'Signed In': { Provider?: string; 'First Time': boolean }
  'Viewed a page': { Path: string; Ref?: string | null }
}
