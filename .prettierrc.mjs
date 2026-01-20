/**
 * @type {import("prettier").Config}
 */
const config = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindStylesheet: 'app/src/styles/globals.css',
  experimentalTernaries: true,
  experimentalOperatorPosition: 'start',
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  importOrder: [
    '^react$',
    '^~/(?!components$)([^/]+)$',
    '^~/styles/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^~/components',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

export default config
