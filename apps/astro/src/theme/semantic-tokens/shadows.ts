import { defineSemanticTokens } from '@pandacss/dev';

// The design system specifies hard-edged elevation, not soft ambient blur, and permits one
// signal colour over grayscale. The Park-UI defaults violated both: every scale step carried
// an 8-24px blur plus `{colors.gray.a7}`, which is the Radix MAUVE alpha ramp — measured
// `rgba(238, 233, 255, 0.25)` at hue 252 on the live namecard. Offsets replace blur, and the
// colour is the atelier surface, matching `.blocky-shadow` in index.css.
const hard = (offset: string) => ({
  value: {
    _light: `${offset} ${offset} 0px 0px {colors.atelier.line}`,
    _dark: `${offset} ${offset} 0px 0px {colors.atelier.surface.lowest}`
  }
});

export const shadows = defineSemanticTokens.shadows({
  xs: hard('1px'),
  sm: hard('2px'),
  md: hard('4px'),
  lg: hard('6px'),
  xl: hard('8px'),
  '2xl': hard('12px')
});
