import bundleAnalyzer from '@next/bundle-analyzer'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { withSentryConfig } from '@sentry/nextjs'

initOpenNextCloudflareForDev() // eslint-disable-next-line import/no-extraneous-dependencies

const withBundleAnalyzer = bundleAnalyzer({
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
    serverComponentsExternalPackages: ['mjml', 'sharp', '@sparticuz/chromium'],
    instrumentationHook: true
  },
  transpilePackages: ['shared', 'database', 'email', 'core'],
  images: Object.assign(imagesConfig, {
    minimumCacheTTL: 60 * 60 * 24 * 90 // 90 days
  })
}

export default withSentryConfig(
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

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true
  }
)
