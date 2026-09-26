import { defineSlotRecipe } from '@pandacss/dev';

export const alert = defineSlotRecipe({
  className: 'alert',
  slots: ['root', 'content', 'description', 'indicator', 'title'],
  base: {
    root: {
      display: 'flex',
      position: 'relative',
      alignItems: 'flex-start',
      borderRadius: 'l3',
      width: 'full'
    },
    content: {
      display: 'flex',
      flex: '1',
      gap: '1',
      flexDirection: 'column'
    },
    description: {
      display: 'inline'
    },
    indicator: {
      display: 'inline-flex',
      flexShrink: '0',
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontWeight: 'semibold'
    }
  },
  variants: {
    size: {
      md: {
        root: {
          textStyle: 'sm',
          gap: '3',
          p: '4'
        },
        indicator: {
          _icon: {
            width: '5',
            height: '5'
          }
        }
      },
      lg: {
        root: {
          textStyle: 'md',
          gap: '4',
          p: '4'
        },
        indicator: {
          _icon: {
            width: '6',
            height: '6'
          }
        }
      }
    },
    variant: {
      solid: {
        root: {
          color: 'colorPalette.solid.fg',
          bg: 'colorPalette.solid.bg'
        }
      },
      surface: {
        root: {
          borderColor: 'colorPalette.surface.border',
          borderWidth: '1px',
          color: 'colorPalette.surface.fg',
          bg: 'colorPalette.surface.bg'
        }
      },
      subtle: {
        root: {
          color: 'colorPalette.subtle.fg',
          bg: 'colorPalette.subtle.bg'
        }
      },
      outline: {
        root: {
          borderColor: 'colorPalette.outline.border',
          borderWidth: '1px',
          color: 'colorPalette.outline.fg'
        }
      }
    },
    status: {
      info: {
        root: { colorPalette: 'amber' }
      },
      warning: {
        root: { colorPalette: 'amber' }
      },
      success: {
        root: { colorPalette: 'amber' }
      },
      error: {
        // The system permits one signal colour, so info/warning/success share the accent.
        // An error must still be distinguishable from a success, and the palette already
        // carries a danger token for exactly that.
        root: {
          colorPalette: 'amber',
          borderColor: 'var(--atelier-danger)',
          color: 'var(--atelier-danger)'
        }
      },
      neutral: {}
    }
  },
  defaultVariants: {
    size: 'md',
    status: 'info',
    variant: 'subtle'
  }
});
