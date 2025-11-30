const path = require('path')
const sharedConfig = require('@samtgarson/eslint-config/prettier.json')

module.exports = {
  ...sharedConfig,
  tailwindStylesheet: path.resolve(
    __dirname,
    '../../web/src/style/globals.css'
  ),
  plugins: [...sharedConfig.plugins, 'prettier-plugin-tailwindcss']
}
