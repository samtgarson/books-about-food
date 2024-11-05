export type TrackableEvents = {
  'Opened a modal': { Extra?: Record<string, unknown>; Modal: string }
  'Signed in': { Provider?: string; 'First Time': boolean }
  'Pressed a button': { Button: string; Extra?: Record<string, unknown> }
  'Viewed a page': {
    Path: string
    Route: string
    Search?: Record<string, unknown>
  }
  'Clicked a link': { URL: string; Label: string }
}
