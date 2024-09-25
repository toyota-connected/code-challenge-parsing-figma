module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules
    'plugin:prettier/recommended', // Enables prettier as an ESLint rule
  ],
  parserOptions: {
    ecmaVersion: 12, // Supports modern ECMAScript features
    sourceType: 'module', // Enables ECMAScript modules
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // Treat prettier errors as ESLint errors
    '@typescript-eslint/no-unused-vars': ['error'], // Disallow unused variables
    'no-console': 'warn', // Warn on console.log() usage
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external', 'internal']],
      },
    ],
    'no-var': 'error', // Disallow var
    'prefer-const': 'error', // Prefer const over let when possible
  },
  ignorePatterns: [
    'node_modules/', // Ignore dependencies folder
    'dist/', // Ignore build output folder
    '.env', // Ignore environment configuration file
    'package-lock.json', // Ignore lock files
    'yarn.lock', // Ignore yarn lock files
    'tsconfig.json', // Ignore TypeScript config file
  ],
};
