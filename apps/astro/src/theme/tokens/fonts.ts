import { defineTokens } from '@pandacss/dev';

export const fonts = defineTokens.fonts({
  sans: {
    value: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif']
  },
  serif: {
    value: ['Newsreader', 'ui-serif', 'Georgia', 'serif']
  },
  mono: {
    value: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
  }
});
