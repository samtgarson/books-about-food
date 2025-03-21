/* eslint-disable-next-line */
const sharedConfig = require('@samtgarson/eslint-config/prettier.json')

module.exports = {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins, 'prettier-plugin-tailwindcss']
}
