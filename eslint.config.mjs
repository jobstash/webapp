import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'public',
      'public/**',
      'public/**/*',
      'scripts',
    ],
  },
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:storybook/recommended',
    ],
    plugins: ['prefer-arrow', 'simple-import-sort', '@tanstack/eslint-plugin-query'],
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
        rules: {
          // Sort
          'simple-import-sort/exports': 'error',
          'simple-import-sort/imports': [
            'error',
            {
              groups: [
                // Side effects first e.g. 'server-only'
                ['^\\u0000'],
                // `react`, `next
                ['^(react|next)'],
                // test dependencies
                ['^(@storybook/react|msw)'],
                // Other npm libraries.
                ['^@?\\w'],
                // Internal packages
                ['^@/lib/shared/core', '^(@)(/.*/core|$)'],
                ['^@/lib/shared/utils', '^(@)(/.*/utils|$)'],
                [
                  '^@/lib/shared/data',
                  '^(@)(/.*/data|$)',
                  '^@/lib/shared/hooks',
                  '^(@)(/.*/hooks|$)',
                ],
                ['^@/lib/shared/api', '^(@)(/.*/api|$)'],
                [
                  '^@/lib/shared/ui',
                  '^(@)(/.*/ui|$)',
                  '^@/lib/shared/features',
                  '^(@)(/.*/features|$)',
                ],
                ['^@/lib/shared/testutils', '^(@)(/.*/testutils|$)'],

                // Parent imports `..`
                ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                // Other relative imports '.'
                ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              ],
            },
          ],
          // Enforce arrow functions
          'prefer-arrow/prefer-arrow-functions': [
            'error',
            {
              disallowPrototype: true,
              singleReturnOnly: true,
              classPropertiesAllowed: false,
            },
          ],
        },
      },
    ],
  }),
];

export default eslintConfig;
