import type { CSSProperties } from 'react';
import { Box } from 'styled-system/jsx';

type BrandMarkProps = {
  size?: number;
  color?: string;
  accent?: string;
};

export const BrandMark = ({
  size = 28,
  color = 'currentColor',
  accent = '#FFB000'
}: BrandMarkProps) => {
  return (
    <Box
      as="span"
      style={
        {
          width: `${size}px`,
          height: `${size}px`,
          '--brand-mark-size': `${size}px`,
          '--brand-mark-color': color,
          '--brand-mark-accent': accent
        } as CSSProperties
      }
      aria-hidden="true"
      display="inline-grid"
      position="relative"
      border="1px solid"
      borderColor="#524533"
      bg="#1c1b1b"
      overflow="hidden"
      placeItems="center"
    >
      <Box
        as="span"
        inset="3px"
        position="absolute"
        borderLeft="2px solid var(--brand-mark-accent)"
        borderRight="2px solid var(--brand-mark-color)"
        opacity="0.8"
      />
      <Box
        as="span"
        position="absolute"
        left="6px"
        right="6px"
        bottom="5px"
        h="2px"
        bg="var(--brand-mark-accent)"
      />
      <Box
        as="span"
        color="var(--brand-mark-accent)"
        fontFamily="Manrope, sans-serif"
        fontSize="max(11px, calc(var(--brand-mark-size) * 0.46))"
        fontWeight="900"
        lineHeight="1"
      >
        H
      </Box>
    </Box>
  );
};
