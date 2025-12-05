import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'backend']),
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react,
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'react-hooks/exhaustive-deps': 'warn',
      // Allow setState in effects for legitimate use cases (like initialization)
      'react-hooks/set-state-in-effect': 'off',
      // Allow impure functions like Date.now() in event handlers
      'react-hooks/purity': 'off',
      // Allow document.body modifications for modals
      'react-hooks/immutability': 'off',
      // Allow exporting non-components from context files
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // React JSX specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
])
