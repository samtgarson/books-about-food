export const imageUrl = (path: string) =>
  new URL(path, process.env.S3_DOMAIN).toString()
