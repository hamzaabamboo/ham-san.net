import { defineConfig } from '@pandacss/dev';
import { theme } from './src/theme';
import { globalCss } from './src/theme/global-css';
import { conditions } from './src/theme/conditions';
import { mauve } from './src/theme/colors/mauve';
import { amber } from './src/theme/colors/amber';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],

  // Where to look for your css declarations
  include: ['./src/**/*.{jsx,tsx,astro}'],

  // Files to exclude
  exclude: [
    process.env.ENVIRONMENT === 'ssr' && '**/static/**',
    process.env.ENVIRONMENT === 'static' && '**/*non-static*/**',
    './src/pages/\\[locale\\]/hobbies/\\[...slug\\]/index.astro',
    './src/graphql/**/*',
    './src/i18n/**/*',
    './src/theme/**/*',
    './src/utils/**/*'
  ].filter((a) => !!a) as string[],

  globalCss,

  staticCss: {
    recipes: {
      // `TagBadge` passes `size` as a variable, so panda cannot extract it statically and
      // emitted CSS for the default variant only. `.badge--size_sm` matched NO rule at all:
      // the sm chips rendered with zero padding at the inherited 14px — larger than the md
      // chip's 12px, with the glyphs touching the 1px border on all four sides.
      badge: [{ size: ['sm', 'md'], variant: ['outline'] }]
    },
    css: [
      {
        properties: {}
      }
    ]
  },
  // Useful for theme customization
  theme: {
    extend: {
      ...theme,
      tokens: {
        ...theme.tokens
      },
      semanticTokens: {
        ...theme.semanticTokens,
        colors: {
          ...theme.semanticTokens?.colors,
          accent: amber,
          gray: mauve,
          mauve: mauve,
          amber: amber
        },
        radii: {
          l1: { value: '{radii.md}' },
          l2: { value: '{radii.lg}' },
          l3: { value: '{radii.xl}' }
        }
      }
    }
  },

  jsxFramework: 'react',

  // The output directory for your css system
  outdir: './styled-system',

  importMap: {
    css: 'styled-system/css',
    recipes: 'styled-system/recipes',
    patterns: 'styled-system/patterns',
    jsx: 'styled-system/jsx'
  },

  conditions,

  lightningcss: true,
  minify: process.env.NODE_ENV === 'production',
  hash: false,
  hooks: {
    // 'cssgen:done': ({ artifact, content }) => {
    //   if (artifact === 'styles.css') {
    //     return removeUnusedCssVars(removeUnusedKeyframes(content));
    //   }
    // }
  }
});
