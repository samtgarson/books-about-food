import { defineConfig, globalIgnores } from "eslint/config"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import baseConfig from '@samtgarson/eslint-config'
import tsConfig from '@samtgarson/eslint-config/typescript.mjs'
import reactConfig from '@samtgarson/eslint-config/react.mjs'
import { includeIgnoreFile } from "@eslint/compat"
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default defineConfig([
  { files: ["**/*.js", "**/*.mjs", "**/*.ts", "**/*.tsx"] },
  includeIgnoreFile(gitignorePath),
  globalIgnores(["packages/e2e/bin/generate-google-token.js", "**/.vercel"]),
  {
    extends: baseConfig,

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      "import-x/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import-x/resolver": {
        typescript: {
          project: ["web/tsconfig.json", "admin/tsconfig.json", "packages/*/tsconfig.json"],
        },

        node: {},
      },
    },

    rules: {
      "import-x/extensions": ["error", {
        "nextauth]": "always",
        svg: "always",
      }],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: tsConfig,
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", {
        destructuredArrayIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      }],
    }
  },
  // {
  //   files: ["**/*.tsx"],
  //   extends: reactConfig
  // },
  // TODO: Fix this
  // {
  //   files: ["web/**/*.ts", "web/**/*.ts"],
  //   extends: compat.extends("next/core-web-vitals", "next/typescript"),
  //   rules: {
  //     "@next/next/no-html-link-for-pages": ["error", "web"],
  //   }
  // },
  {
    files: [
      "packages/core/**/*.ts",
      "packages/core/**/*.tsx",
      "packages/e2e/**/*.ts",
      "admin/build.js",
    ],

    rules: {
      "import-x/no-extraneous-dependencies": 0,
    },
  },
])
