module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  rules: {
    // enable additional rules
    // disable the rule for all files
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    // override default options for rules from base configurations
    'no-cond-assign': ['error', 'always'],

    // disable rules from base configurations
    'no-console': 'warn',

    'prettier/prettier': 1, // 2 means error, 1 means warn and 0 means off
  },
};
