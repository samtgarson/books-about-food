const { withSentryConfig } = require('@sentry/nextjs')
// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

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
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
    serverActions: {
      bodySizeLimit: '4mb'
    },
    serverComponentsExternalPackages: ['mjml', 'sharp']
  },
  transpilePackages: [
    '@books-about-food/shared',
    '@books-about-food/database',
    '@books-about-food/email',
    '@books-about-food/core',
    '@books-about-food/jobs'
  ],
  images: Object.assign(imagesConfig, {
    minimumCacheTTL: 60 * 60 * 24 * 90 // 90 days
  })
}

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    silent: true,
    org: 'books-about-food',
    project: 'baf-web'
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true
  }
)
