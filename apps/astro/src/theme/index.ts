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
  keyframes: {
    ...keyframes,
    pyon: {
      '0%, 25%, 50%, 100%': {
        transform: 'translateY(0%)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
      },
      '12.5%, 37.5%': {
        transform: 'translateY(-5%)',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
      }
    },
    'fade-in-up': {
      '0%': {
        opacity: '0',
        transform: 'translateY(20px)'
      },
      '100%': {
        opacity: '1',
        transform: 'translateY(0)'
      }
    },
    spin: {
      '0%': {
        transform: 'rotateY(0deg)'
      },
      '100%': {
        transform: 'rotateY(360deg)'
      }
    },
    marquee: {
      '0%': {
        transform: 'translateX(0)'
      },
      '100%': {
        transform: 'translateX(-50%)'
      }
    }
  },
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
