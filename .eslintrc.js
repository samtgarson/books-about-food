const project = [
  'web/tsconfig.json',
  'admin/tsconfig.json',
  'packages/*/tsconfig.json'
]

module.exports = {
  extends: ['@samtgarson/eslint-config', 'plugin:import/typescript'],
  env: {
    es6: true
  },
  root: true,
  ignorePatterns: ['packages/e2e/bin/generate-google-token.js'],
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
    },
    {
      files: [
        'packages/core/**/*.ts',
        'packages/core/**/*.tsx',
        'packages/e2e/**/*.ts',
        'admin/build.js'
      ],
      rules: {
        'import/no-extraneous-dependencies': 0
      }
    }
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: { project },
      node: {}
    }
  },
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'web'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { destructuredArrayIgnorePattern: '^_', argsIgnorePattern: '^_' }
    ],
    'import/extensions': [
      'error',
      {
        'nextauth]': 'always',
        svg: 'always'
      }
    ]
  }
}
