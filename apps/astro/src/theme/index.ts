import { type PartialTheme } from '@pandacss/types';

export const theme: PartialTheme = {
  semanticTokens: {
    animations: {
      pyon: { value: 'pyon 2s linear infinite' },
      kanatapeek: { value: 'kanatapeek 4s ease-in infinite' }
    }
  },
  keyframes: {
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
    kanatapeek: {
      '0%, 75%, 100%': {
        transform: 'scaleX(-100%) translate(100%,100%)'
      },
      '25%, 50%': {
        transform: 'scaleX(-100%) translate(0,0)'
      }
    },
    spin: {
      '0%': {
        transform: 'rotateY(0deg)'
      },
      '100%': {
        transform: 'rotateY(360deg)'
      }
    }
  }
};
