import type { CSSProperties } from 'react';
import { Box } from 'styled-system/jsx';

type BrandMarkProps = {
  accent?: string;
};

export const BrandMark = ({ accent = '#FFB000' }: BrandMarkProps) => {
  return (
    <Box
      as="span"
      style={
        {
          '--brand-mark-accent': accent
        } as CSSProperties
      }
      aria-label="Ham"
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      border="1px solid"
      borderColor="var(--brand-mark-accent)"
      minW="3.75rem"
      h="1.75rem"
      px="2"
      color="var(--brand-mark-accent)"
      fontFamily="JetBrains Mono, monospace"
      fontSize="11px"
      fontWeight="800"
      letterSpacing="0.12em"
      lineHeight="1"
    >
      HAM
    </Box>
  );
};
