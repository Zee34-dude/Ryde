const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier/recommended');

module.exports = [
  ...expo,
  prettier,
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    ignores: ['dist/*', '.gemini/antigravity/brain/*'],
  },
];
