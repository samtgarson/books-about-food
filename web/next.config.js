const withTM = require('next-transpile-modules')([
  // Add "math-helpers" to this array:
  'shared'
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  }
}

module.exports = withTM(nextConfig)
