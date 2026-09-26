import { defineTokens } from '@pandacss/dev';
import { animations } from './animations';
import { atelier } from './atelier';
import { blurs } from './blurs';
import { borders } from './borders';
import { colors } from './colors';
import { durations } from './durations';
import { easings } from './easings';
import { fontSizes } from './font-sizes';
import { fontWeights } from './font-weights';
import { letterSpacings } from './letter-spacings';
import { lineHeights } from './line-heights';
import { radii } from './radii';
import { sizes } from './sizes';
import { spacing } from './spacing';
import { zIndex } from './z-index';

export const tokens = defineTokens({
  animations,
  blurs,
  borders,
  colors: { ...colors, atelier },
  durations,
  easings,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  sizes,
  spacing,
  zIndex
});
