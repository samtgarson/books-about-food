export const trackingEnabled =
  process.env.NODE_ENV !== 'development' ||
  process.env.ENABLE_TRACKING_IN_DEV === 'true'

export const token = process.env.MIXPANEL_TOKEN
