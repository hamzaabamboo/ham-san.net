import type { CSSProperties } from 'react';
import { Box } from 'styled-system/jsx';

type BrandMarkProps = {
  accent?: string;
  compact?: boolean;
};

export const BrandMark = ({ accent = '#FFB000', compact = false }: BrandMarkProps) => {
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
      gap="2"
      alignItems="center"
      color="var(--brand-mark-accent)"
      fontFamily="JetBrains Mono, monospace"
      fontSize="12px"
      fontWeight="900"
      letterSpacing="0.12em"
      lineHeight="1"
    >
      <Box
        as="span"
        aria-hidden="true"
        display="inline-block"
        pos="relative"
        border="1px solid"
        borderColor="var(--brand-mark-accent)"
        w="2rem"
        h="2rem"
        bg="rgba(255, 176, 0, 0.05)"
        boxShadow="inset 0 0 0 1px rgba(255, 176, 0, 0.14), 5px 5px 0 rgba(255, 176, 0, 0.08)"
      >
        <Box
          as="span"
          pos="absolute"
          top="0.45rem"
          left="0.45rem"
          bottom="0.45rem"
          w="2px"
          bg="var(--brand-mark-accent)"
        />
        <Box
          as="span"
          pos="absolute"
          top="0.45rem"
          right="0.45rem"
          bottom="0.45rem"
          w="2px"
          bg="var(--brand-mark-accent)"
        />
        <Box
          as="span"
          pos="absolute"
          top="calc(50% - 1px)"
          left="0.45rem"
          right="0.45rem"
          h="2px"
          bg="var(--brand-mark-accent)"
        />
      </Box>
      {!compact && (
        <Box as="span" display={{ base: 'none', sm: 'inline' }}>
          HAM
        </Box>
      )}
    </Box>
  );
};
