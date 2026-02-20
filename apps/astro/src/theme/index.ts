import { recipes, slotRecipes } from './recipes';
import { semanticTokens } from './semantic-tokens';
import { tokens } from './tokens';
import { keyframes } from './keyframes';

export const theme = {
  layerStyles: {
    textStroke: {
      value: {
        WebkitTextStrokeWidth: '0.23',
        WebkitTextStrokeColor: '{colors.fg.default}'
      }
    },
    contentHeight: {
      value: {
        height: {
          base: 'calc(100dvh - 64px - 60px)',
          md: 'calc(100dvh - 64px)'
        }
      }
    }
  },
  tokens,
  semanticTokens,
  keyframes,
  recipes: {
    ...recipes,
    formLabel: {
      ...recipes.formLabel,
      base: {
        ...recipes.formLabel.base,
        fontWeight: { value: 'bold' }
      }
    }
  },
  slotRecipes
};
