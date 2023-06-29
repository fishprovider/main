const rules = {
  '@typescript-eslint/ban-ts-comment': [
    'error',
    { 'ts-ignore': 'allow-with-description' },
  ],
  '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/quotes': ['error', 'single'],
  '@typescript-eslint/restrict-template-expressions': 'off',
  camelcase: 'off',
  'comma-dangle': ['error', 'always-multiline'],
  'global-require': 'off',
  'import/extensions': 'off',
  'import/no-extraneous-dependencies': 'off',
  'import/order': 'off',
  'import/prefer-default-export': 'off',
  'no-await-in-loop': 'off',
  'no-console': 'off',
  'no-restricted-exports': 'off',
  'no-restricted-syntax': 'off',
  'no-underscore-dangle': 'off',
  'no-unused-vars': 'off',
  quotes: ['error', 'single'],
  "react/jsx-filename-extension": [
    "error",
    { extensions: [".js", ".jsx", ".tsx"] },
  ],
  "react/jsx-props-no-spreading": "off",
  "react/no-array-index-key": "off",
  "react/prop-types": "off",
  "react/react-in-jsx-scope": "off",
  "react/require-default-props": "off",
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
};

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
