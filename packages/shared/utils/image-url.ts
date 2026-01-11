export function imageUrl(path: string, prefix: string | null | undefined = "") {
  const fullPath = prefix ? `${prefix}/${path}` : path;
  return new URL(fullPath, process.env.S3_DOMAIN).toString();
}
