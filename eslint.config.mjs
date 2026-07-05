import { includeIgnoreFile } from '@eslint/compat'
import baseConfig from '@samtgarson/eslint-config'
import reactConfig from '@samtgarson/eslint-config/react.mjs'
import tsConfig from '@samtgarson/eslint-config/typescript.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default defineConfig([
  { files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'] },
  includeIgnoreFile(gitignorePath),
  globalIgnores([
    '.husky',
    'e2e/bin/generate-google-token.js',
    'src/app/(payload)',
    'src/payload/migrations/**/*',
    '!src/payload/migrations/from-prisma/**/*'
  ]),
  {
    extends: [baseConfig, tsConfig, eslintConfigPrettier],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },

    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },

      'import-x/resolver': {
        typescript: {
          project: ['tsconfig.json', 'e2e/tsconfig.json']
        },

        node: {}
      }
    },

    rules: {
      'import-x/extensions': [
        'error',
        {
          json: 'always',
          svg: 'always'
        }
      ],
      'import-x/no-named-as-default': 0,
      'import-x/no-named-as-default-member': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          destructuredArrayIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unsafe-assignment': 0,
      'no-fallthrough': ['error', { allowEmptyCase: true }]
    }
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    extends: reactConfig
  },
  {
    files: ['eslint.config.mjs', 'prettier.config.js', 'e2e/**/*.ts'],

    rules: {
      'import-x/no-extraneous-dependencies': 0,
      '@typescript-eslint/no-require-imports': 0
    }
  },
  {
    files: ['src/payload/**/*'],
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-unsafe-return': 0
    }
  }
])
