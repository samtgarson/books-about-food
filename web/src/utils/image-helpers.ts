export const imageSrc = (src: string) =>
  new URL(src, process.env.NEXT_PUBLIC_S3_DOMAIN).toString()
