import { defineSemanticTokens } from '@pandacss/dev';

export const colors = defineSemanticTokens.colors({
  bg: {
    canvas: { value: { _light: '{colors.gray.1}', _dark: '{colors.atelier.bg}' } },
    default: { value: { _light: 'white', _dark: '{colors.atelier.surface.lowest}' } },
    subtle: { value: { _light: '{colors.gray.2}', _dark: '{colors.atelier.surface.low}' } },
    muted: { value: { _light: '{colors.gray.3}', _dark: '{colors.atelier.surface}' } },
    emphasized: { value: { _light: '{colors.gray.4}', _dark: '{colors.atelier.surface.high}' } },
    disabled: { value: { _light: '{colors.gray.5}', _dark: '{colors.atelier.surface.highest}' } }
  },
  fg: {
    default: { value: { _light: '{colors.gray.12}', _dark: '{colors.atelier.fg}' } },
    muted: { value: { _light: '{colors.gray.11}', _dark: '{colors.atelier.fgMuted}' } },
    subtle: { value: { _light: '{colors.gray.10}', _dark: '{colors.atelier.outline}' } },
    disabled: { value: { _light: '{colors.gray.9}', _dark: '{colors.atelier.line}' } },
    error: { value: { _light: '{colors.atelier.danger}', _dark: '{colors.atelier.danger}' } }
  },
  border: {
    default: { value: { _light: '{colors.gray.7}', _dark: '{colors.atelier.line}' } },
    muted: { value: { _light: '{colors.gray.6}', _dark: '{colors.atelier.line}' } },
    subtle: { value: { _light: '{colors.gray.4}', _dark: '{colors.atelier.surface.highest}' } },
    disabled: { value: { _light: '{colors.gray.5}', _dark: '{colors.atelier.surface.high}' } },
    outline: { value: { _light: '{colors.gray.a9}', _dark: '{colors.atelier.outline}' } },
    error: { value: { _light: '{colors.atelier.danger}', _dark: '{colors.atelier.danger}' } }
  }
});
