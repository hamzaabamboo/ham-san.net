import { defineConfig } from '@pandacss/dev';
import { theme } from './src/theme';
import { globalCss } from './src/theme/global-css';
import { conditions } from './src/theme/conditions';
import { blue } from './src/theme/colors/blue';
import { mauve } from './src/theme/colors/mauve';
import { red } from './src/theme/colors/red';
import { green } from './src/theme/colors/green';
import { amber } from './src/theme/colors/amber';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    '@pandacss/preset-base',
    '@pandacss/preset-panda'
  ],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],

  // Files to exclude
  exclude: [
    process.env.ENVIRONMENT === 'ssr' && '**/static/**',
    process.env.ENVIRONMENT === 'static' && '**/*non-static*/**'
  ].filter((a) => !!a) as string[],

  globalCss,

  staticCss: {
    recipes: {
      // text: ['*']
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
          accent: blue,
          blue: blue,
          gray: mauve,
          mauve: mauve,
          red: red,
          green: green,
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
  hash:
    process.env.NODE_ENV === 'production'
      ? {
          className: true,
          cssVar: true
        }
      : false,
  hooks: {
    // 'cssgen:done': ({ artifact, content }) => {
    //   if (artifact === 'styles.css') {
    //     return removeUnusedCssVars(removeUnusedKeyframes(content));
    //   }
    // }
  }
});
