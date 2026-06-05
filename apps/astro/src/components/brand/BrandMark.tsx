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
      display="inline-block"
      position="relative"
    >
      <Box
        as="span"
        position="absolute"
        top="18%"
        left="8%"
        w="76%"
        h="16%"
        bg="var(--brand-mark-accent)"
      />
      <Box
        as="span"
        position="absolute"
        top="42%"
        left="8%"
        w="54%"
        h="16%"
        bg="var(--brand-mark-color)"
        opacity="0.85"
      />
      <Box
        as="span"
        position="absolute"
        top="66%"
        left="8%"
        w="34%"
        h="16%"
        bg="var(--brand-mark-accent)"
      />
    </Box>
  );
};
