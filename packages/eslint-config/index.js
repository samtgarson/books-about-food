module.exports = {
  extends: ['@samtgarson/eslint-config'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['@samtgarson/eslint-config/typescript']
    },
    {
      files: ['**/*.tsx'],
      extends: ['@samtgarson/eslint-config/react', 'plugin:react/jsx-runtime']
    }
  ]
}
