import { type PartialTheme } from '@pandacss/types';

import blue from '@park-ui/panda-preset/colors/blue';
import green from '@park-ui/panda-preset/colors/green';
import orange from '@park-ui/panda-preset/colors/orange';
import purple from '@park-ui/panda-preset/colors/purple';
import red from '@park-ui/panda-preset/colors/red';
import sand from '@park-ui/panda-preset/colors/sand';

const additionalColors = [red, blue, orange, green, purple, sand];

export const theme: PartialTheme = {
  semanticTokens: {
    animations: {
      pyon: { value: 'pyon 2s linear infinite' },
      kanatapeek: { value: 'kanatapeek 4s ease-in infinite' }
    },
    colors: {
      ...Object.fromEntries(additionalColors.map((t) => [t.name, t.semanticTokens]))
    }
  },
  tokens: {
    colors: {
      ...Object.fromEntries(additionalColors.map((t) => [t.name, t.tokens]))
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
