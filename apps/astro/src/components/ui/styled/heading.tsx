import { styled } from 'styled-system/jsx'
import { type TextVariantProps, text } from 'styled-system/recipes'
import type { ComponentProps, StyledComponent } from 'styled-system/types'

type TextProps = TextVariantProps & { as?: React.ElementType }

export type HeadingProps = ComponentProps<typeof Heading>
// The generated recipe overload does not accept `variant` in `defaultProps`, so this is
// asserted through the recipe's own props type. The public type is fixed by the cast below.
export const Heading = styled('h2', text, {
  defaultProps: { variant: 'heading' } as Record<string, unknown>,
}) as StyledComponent<'h2', TextProps>
