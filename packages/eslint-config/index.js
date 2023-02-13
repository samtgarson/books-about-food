module.exports = {
  extends: ['@samtgarson/eslint-config'],
  env: {
    es6: true
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['@samtgarson/eslint-config/typescript']
    },
    {
      files: ['**/*.tsx'],
      extends: ['@samtgarson/eslint-config/react', 'plugin:react/jsx-runtime']
    },
    {
      files: ['web/**/*.ts', 'web/**/*.ts'],
      extends: ['next/core-web-vitals', 'plugin:@next/next/recommended']
    }
  ],
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'web'],
    'import/extensions': [
      'error',
      {
        'nextauth]': 'always',
        svg: 'always'
      }
    ]
  }
}
