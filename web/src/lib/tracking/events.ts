export type TrackableEvents = {
  'Opened a modal': { Extra?: Record<string, unknown>; Modal: string }
  'Signed In': { Provider?: string; 'First Time': boolean }
  'Pressed a button': { Button: string; Extra?: Record<string, unknown> }
  'Viewed a page': {
    Path: string
    Ref?: string | null
    Search?: Record<string, unknown>
  }
}
