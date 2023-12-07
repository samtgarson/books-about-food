/** @type {import('@sentry/esbuild-plugin')} */
const { sentryEsbuildPlugin } = require('@sentry/esbuild-plugin')
/** @type {import('esbuild')} */
const esbuild = require('esbuild')
const path = require('path')

const sentryToken = process.env.SENTRY_AUTH_TOKEN
const plugins = []

if (sentryToken) {
  plugins.push(
    sentryEsbuildPlugin({
      org: 'books-about-food',
      project: 'baf-admin',
      authToken: sentryToken,
      release: {
        setCommits: {
          repo: 'samtgarson/books-about-food',
          commit: process.env.HEROKU_SLUG_COMMIT
        },
        dist: process.env.HEROKU_SLUG_COMMIT,
        name: process.env.HEROKU_SLUG_COMMIT,
        inject: true,
        create: true
      }
    })
  )
}

esbuild.build({
  entryPoints: [path.resolve(__dirname, 'lib/index.ts')],
  sourcemap: true, // Source map generation must be turned on
  bundle: true,
  outfile: path.resolve(__dirname, 'dist/index.js'),
  platform: 'node',
  external: [
    'fastify',
    'pg-hstore',
    'pg-native',
    '@prisma/client',
    'sharp',
    'uglify-js'
  ],
  loader: {
    '.node': 'file'
  },
  target: 'node20',
  jsx: 'automatic',
  plugins,
  logLevel: 'info'
})
