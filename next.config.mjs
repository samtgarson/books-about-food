import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig['images']} */
const imagesConfig =
  process.env.NODE_ENV === 'production'
    ? {
        loader: 'custom',
        loaderFile: './src/lib/cloudflare/image-loader.ts'
      }
    : { unoptimized: true }

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    S3_DOMAIN: process.env.S3_DOMAIN
  },
  serverExternalPackages: ['mjml', 'sharp', '@sparticuz/chromium'],
  experimental: {
    // swcPlugins: [['next-superjson-plugin', {}]],
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  // typedRoutes: true,
  images: Object.assign(imagesConfig, {
    minimumCacheTTL: 60 * 60 * 24 * 90 // 90 days
  })
}

export default withPayload(nextConfig)
