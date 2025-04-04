const sharedConfig = require('@samtgarson/eslint-config/prettier.json')

module.exports = {
  ...sharedConfig,
  plugins: [
    ...sharedConfig.plugins,
    require.resolve('prettier-plugin-tailwindcss')
  ]
}
