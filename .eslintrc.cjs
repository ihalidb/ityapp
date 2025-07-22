module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // project: './tsconfig.json', // KALDIRILDI: Lint hatalarını engellemek için
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    // Özel kurallar buraya eklenebilir
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 