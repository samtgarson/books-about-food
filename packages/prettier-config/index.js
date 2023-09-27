/* eslint-disable-next-line */
const sharedConfig = require('@samtgarson/eslint-config/prettier.json')

/** @type {import("prettier").Config} */
const config = Object.assign({}, sharedConfig, {
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports']
})

module.exports = config
