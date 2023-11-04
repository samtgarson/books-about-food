/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: []
        }
      ]
    ],
    serverActionsBodySizeLimit: '2mb',
    serverComponentsExternalPackages: ['mjml']
  },
  transpilePackages: ['shared', 'database', 'email'],
  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 90, // 90 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_S3_DOMAIN).hostname
      }
    ]
  }
}

module.exports = nextConfig
