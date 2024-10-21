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
    S3_DOMAIN: process.env.S3_DOMAIN,
    SHOW_TAKEOVER: process.env.SHOW_TAKEOVER
  },
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
    serverActions: {
      bodySizeLimit: '4mb'
    },
    serverComponentsExternalPackages: ['mjml', 'sharp', '@sparticuz/chromium']
  },
  transpilePackages: ['shared', 'database', 'email', 'core'],
  images: Object.assign(imagesConfig, {
    minimumCacheTTL: 60 * 60 * 24 * 90 // 90 days
  })
}

// Injected content via Sentry wizard below
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'books-about-food',
    project: 'baf-web'
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true
  }
)
