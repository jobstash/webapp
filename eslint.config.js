import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'antfu/top-level-function': 'off',
    'react-refresh/only-export-components': 'off',
    'node/prefer-global/process': 'off',
  },
  ignores: [
    'public/init-shader.js',
  ],
  stylistic: {
    quotes: 'single',
    semi: true,
    indent: 2,
    jsx: true,
  },
});
