import { defineTokens } from '@pandacss/dev';

export const atelier = defineTokens.colors({
  bg: { value: '#131313' },
  fg: { value: '#e5e2e1' },
  fgMuted: { value: '#c7c6c6' },
  surface: {
    lowest: { value: '#0e0e0e' },
    low: { value: '#1c1b1b' },
    DEFAULT: { value: '#201f1f' },
    high: { value: '#2a2a2a' },
    highest: { value: '#353534' }
  },
  outline: { value: '#9f8e78' },
  line: { value: '#524533' },
  accent: { value: '#ffb000' },
  accentSoft: { value: '#ffd597' },
  onAccent: { value: '#432c00' },
  danger: { value: '#ffb4ab' }
});
