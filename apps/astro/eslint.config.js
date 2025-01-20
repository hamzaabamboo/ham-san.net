import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.js';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});
const config = tseslint.config(
  ...baseConfig,
  {
    ignores: [
      '**/styled-system/*',
      '**/generated/*',
      '**/components/ui/**/*',
      '**/lib/**/*',
      '*.config.*'
    ]
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
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off'
    }
  },
  ...compat.config({ extends: ['plugin:@pandacss/recommended'] }),
  {
    rules: {
      '@pandacss/no-unsafe-token-fn-usage': 'off',
      '@pandacss/no-hardcoded-color': 'off'
    }
  },
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.astro', '**/*.ts', '**/*.tsx', '**/*.js'],
    rules: {
      'astro/valid-compile': 'warn',
      '@typescript-eslint/no-misused-promises': 'off'
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
