import { defineSemanticTokens } from '@pandacss/dev';

export const blue = defineSemanticTokens.colors({
  '1': { value: { _light: '#fafdff', _dark: '#091218' } },
  '2': { value: { _light: '#f3fafe', _dark: '#0f1a21' } },
  '3': { value: { _light: '#e2f4ff', _dark: '#0b2a3c' } },
  '4': { value: { _light: '#d0eeff', _dark: '#003651' } },
  '5': { value: { _light: '#bde5ff', _dark: '#014361' } },
  '6': { value: { _light: '#a7d8f9', _dark: '#115172' } },
  '7': { value: { _light: '#8ac8f0', _dark: '#1e6389' } },
  '8': { value: { _light: '#58b2e6', _dark: '#267aa8' } },
  '9': { value: { _light: '#239fdd', _dark: '#239fdd' } },
  '10': { value: { _light: '#1f92cc', _dark: '#0493d0' } },
  '11': { value: { _light: '#0079b4', _dark: '#6ac2f7' } },
  '12': { value: { _light: '#113a50', _dark: '#c1e7ff' } },
  a1: { value: { _light: '#0099ff05', _dark: '#0031f108' } },
  a2: { value: { _light: '#0095ea0c', _dark: '#0091f412' } },
  a3: { value: { _light: '#009fff1d', _dark: '#0099fb2f' } },
  a4: { value: { _light: '#00a3ff2f', _dark: '#009afe45' } },
  a5: { value: { _light: '#009bff42', _dark: '#00a6ff56' } },
  a6: { value: { _light: '#008eee58', _dark: '#11aeff68' } },
  a7: { value: { _light: '#0088df75', _dark: '#2bb4ff81' } },
  a8: { value: { _light: '#008ad9a7', _dark: '#33b7ffa2' } },
  a9: { value: { _light: '#0090d8dc', _dark: '#26b7ffdb' } },
  a10: { value: { _light: '#0083c5e0', _dark: '#01b3ffcd' } },
  a11: { value: { _light: '#0079b4', _dark: '#6cc7fef7' } },
  a12: { value: { _light: '#002c44ee', _dark: '#c1e7ff' } },
  '50': { value: '{colors.blue.1}' },
  '100': { value: '{colors.blue.2}' },
  '200': { value: '{colors.blue.3}' },
  '300': { value: '{colors.blue.4}' },
  '400': { value: '{colors.blue.5}' },
  '500': { value: '{colors.blue.6}' },
  '600': { value: '{colors.blue.7}' },
  '700': { value: '{colors.blue.8}' },
  '800': { value: '{colors.blue.9}' },
  '900': { value: '{colors.blue.10}' },
  '950': { value: '{colors.blue.11}' },
  default: { value: { _light: '{colors.blue.9}', _dark: '{colors.blue.9}' } },
  solid: {
    bg: {
      DEFAULT: { value: { _light: '{colors.blue.9}', _dark: '{colors.blue.9}' } },
      hover: { value: { _light: '{colors.blue.10}', _dark: '{colors.blue.10}' } }
    },
    fg: { DEFAULT: { value: { _light: 'white', _dark: 'white' } } }
  },
  subtle: {
    bg: {
      DEFAULT: { value: { _light: '{colors.blue.a3}', _dark: '{colors.blue.a3}' } },
      hover: { value: { _light: '{colors.blue.a4}', _dark: '{colors.blue.a4}' } },
      active: { value: { _light: '{colors.blue.a5}', _dark: '{colors.blue.a5}' } }
    },
    fg: { DEFAULT: { value: { _light: '{colors.blue.a11}', _dark: '{colors.blue.a11}' } } }
  },
  surface: {
    bg: {
      DEFAULT: { value: { _light: '{colors.blue.a2}', _dark: '{colors.blue.a2}' } },
      active: { value: { _light: '{colors.blue.a3}', _dark: '{colors.blue.a3}' } }
    },
    border: {
      DEFAULT: { value: { _light: '{colors.blue.a6}', _dark: '{colors.blue.a6}' } },
      hover: { value: { _light: '{colors.blue.a7}', _dark: '{colors.blue.a7}' } }
    },
    fg: { DEFAULT: { value: { _light: '{colors.blue.a11}', _dark: '{colors.blue.a11}' } } }
  },
  outline: {
    bg: {
      hover: { value: { _light: '{colors.blue.a2}', _dark: '{colors.blue.a2}' } },
      active: { value: { _light: '{colors.blue.a3}', _dark: '{colors.blue.a3}' } }
    },
    border: { DEFAULT: { value: { _light: '{colors.blue.a7}', _dark: '{colors.blue.a7}' } } },
    fg: { DEFAULT: { value: { _light: '{colors.blue.a11}', _dark: '{colors.blue.a11}' } } }
  },
  plain: {
    bg: {
      hover: { value: { _light: '{colors.blue.a3}', _dark: '{colors.blue.a3}' } },
      active: { value: { _light: '{colors.blue.a4}', _dark: '{colors.blue.a4}' } }
    },
    fg: { DEFAULT: { value: { _light: '{colors.blue.a11}', _dark: '{colors.blue.a11}' } } }
  }
});
