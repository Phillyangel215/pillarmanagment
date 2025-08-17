import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import security from 'eslint-plugin-security'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'node_modules', 'build', '*.config.js', '*.config.ts', 'components/**/*', 'handoff/**/*', 'supabase/**/*', 'workflows/**/*', 'src/components/**/*', 'src/test/**/*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'security': security,
      'jsx-a11y': jsxA11y,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...security.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      
      // Enterprise security rules
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      
      // React rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      
      // Accessibility rules
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      
      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'no-implicit-coercion': 'error',
    },
  },
]