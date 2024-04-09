import eslintPluginSvelte from 'eslint-plugin-svelte';
import baseConfig from '../../eslint.config.js';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});
const config = tseslint.config(
  ...baseConfig,
  {
    ignores: ['**/.svelte-kit/**/*', '**/generated/*', '**/*.config.js', '**/*.config.ts']
  },
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c
  })),
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }]
    }
  },
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte', '**/*.ts', '**/*.tsx', '**/*.js'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      "@typescript-eslint/no-unsafe-assignment": "off"
    }
  },
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  }
);

export default config;
