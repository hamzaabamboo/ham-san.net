import { defineTokens } from '@pandacss/dev';

export const colors = defineTokens.colors({
  current: { value: 'currentColor' },
  black: {
    DEFAULT: { value: '#000000' },
    a1: { value: 'rgba(0, 0, 0, 0.05)' },
    a2: { value: 'rgba(0, 0, 0, 0.1)' },
    a3: { value: 'rgba(0, 0, 0, 0.15)' },
    a4: { value: 'rgba(0, 0, 0, 0.2)' },
    a5: { value: 'rgba(0, 0, 0, 0.3)' },
    a6: { value: 'rgba(0, 0, 0, 0.4)' },
    a7: { value: 'rgba(0, 0, 0, 0.5)' },
    a8: { value: 'rgba(0, 0, 0, 0.6)' },
    a9: { value: 'rgba(0, 0, 0, 0.7)' },
    a10: { value: 'rgba(0, 0, 0, 0.8)' },
    a11: { value: 'rgba(0, 0, 0, 0.9)' },
    a12: { value: 'rgba(0, 0, 0, 0.95)' }
  },
  white: {
    DEFAULT: { value: '#ffffff' },
    a1: { value: 'rgba(255, 255, 255, 0.05)' },
    a2: { value: 'rgba(255, 255, 255, 0.1)' },
    a3: { value: 'rgba(255, 255, 255, 0.15)' },
    a4: { value: 'rgba(255, 255, 255, 0.2)' },
    a5: { value: 'rgba(255, 255, 255, 0.3)' },
    a6: { value: 'rgba(255, 255, 255, 0.4)' },
    a7: { value: 'rgba(255, 255, 255, 0.5)' },
    a8: { value: 'rgba(255, 255, 255, 0.6)' },
    a9: { value: 'rgba(255, 255, 255, 0.7)' },
    a10: { value: 'rgba(255, 255, 255, 0.8)' },
    a11: { value: 'rgba(255, 255, 255, 0.9)' },
    a12: { value: 'rgba(255, 255, 255, 0.95)' }
  },
  transparent: { value: 'rgb(0 0 0 / 0)' },
  amber: {
    50: { value: '#fffbeb' },
    100: { value: '#fef3c7' },
    200: { value: '#fde68a' },
    300: { value: '#fcd34d' },
    400: { value: '#ffc233' },
    500: { value: '#ffb000' },
    600: { value: '#d97706' },
    700: { value: '#b45309' },
    800: { value: '#92400e' },
    900: { value: '#78350f' },
    950: { value: '#451a03' }
  }
});
