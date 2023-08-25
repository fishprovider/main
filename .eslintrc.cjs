const rules = {
  '@typescript-eslint/ban-ts-comment': [
    'error',
    { 'ts-ignore': 'allow-with-description' },
  ],
  '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
  '@typescript-eslint/lines-between-class-members': 'off',
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_.+', varsIgnorePattern: '^_.+' },
  ],
  '@typescript-eslint/no-var-requires': 'warn',
  '@typescript-eslint/quotes': ['error', 'single'],
  '@typescript-eslint/restrict-template-expressions': 'off',
  camelcase: 'off',
  'comma-dangle': ['error', 'always-multiline'],
  'global-require': 'off',
  'import/no-cycle': 'off',
  'import/export': 'off',
  'import/extensions': 'off',
  'import/no-extraneous-dependencies': 'off',
  'import/no-named-as-default': 'off',
  'import/no-named-as-default-member': 'off',
  'import/order': 'off',
  'import/prefer-default-export': 'off',
  'max-len': 'warn',
  'no-await-in-loop': 'off',
  'no-console': 'off',
  'no-restricted-exports': 'off',
  'no-restricted-syntax': 'off',
  'no-underscore-dangle': 'off',
  'no-unused-vars': 'off',
  quotes: ['error', 'single'],
  'react/jsx-filename-extension': [
    'error',
    { extensions: ['.js', '.jsx', '.tsx'] },
  ],
  'react/jsx-props-no-spreading': 'off',
  'react/no-array-index-key': 'off',
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/require-default-props': 'off',
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    'simple-import-sort',
  ],
  ignorePatterns: [
    '**/node_modules',
    '**/dist',
    '**/build',
    '**/tmp',
  ],
  rules,
  env: {
    es2022: true,
    node: true,
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
  globals: {
    Logger: true,
  },
};
