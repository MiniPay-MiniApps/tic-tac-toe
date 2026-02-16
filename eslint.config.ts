/*
 * Copyright 2016-2026, Opera Norway AS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import js from '@eslint/js'
import header from '@tony.ganchev/eslint-plugin-header'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: [
      'node_modules',
      'dist',
      'app/dist',
      'pnpm-lock.yaml',
      'contract/artifacts/**',
      'contract/cache/**',
      'app/coverage/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
      },
    },
  },
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.config.ts', '**/*.prettierrc.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@tony.ganchev': header },
    rules: {
      '@tony.ganchev/header': [
        'error',
        {
          header: {
            commentType: 'block',
            lines: [
              '',
              {
                pattern: / \* Copyright 2016-\d{4}, Opera Norway AS/,
                template: ` * Copyright 2016-${new Date().getFullYear()}, Opera Norway AS`,
              },
              ' *',
              ' * Licensed under the Apache License, Version 2.0 (the "License");',
              ' * you may not use this file except in compliance with the License.',
              ' * You may obtain a copy of the License at:',
              ' *',
              ' * http://www.apache.org/licenses/LICENSE-2.0',
              ' *',
              ' * Unless required by applicable law or agreed to in writing, software',
              ' * distributed under the License is distributed on an "AS IS" BASIS,',
              ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
              ' * See the License for the specific language governing permissions and',
              ' * limitations under the License.',
              ' ',
            ],
          },
          trailingEmptyLines: { minimum: 0 },
        },
      ],
    },
  },
  eslintConfigPrettier,
])
