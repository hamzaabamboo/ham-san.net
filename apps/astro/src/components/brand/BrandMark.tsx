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
        top="10%"
        left="10%"
        w="18%"
        h="80%"
        bg="var(--brand-mark-accent)"
      />
      <Box
        as="span"
        position="absolute"
        top="10%"
        right="10%"
        w="18%"
        h="80%"
        bg="var(--brand-mark-color)"
      />
      <Box
        as="span"
        position="absolute"
        top="40%"
        left="10%"
        w="80%"
        h="18%"
        bg="var(--brand-mark-accent)"
      />
      <Box
        as="span"
        position="absolute"
        top="10%"
        left="37%"
        transform="skewX(-18deg)"
        w="18%"
        h="80%"
        bg="var(--brand-mark-color)"
        opacity="0.72"
      />
      <Box
        as="span"
        position="absolute"
        top="10%"
        right="10%"
        w="30%"
        h="18%"
        bg="var(--brand-mark-color)"
        opacity="0.86"
      />
    </Box>
  );
};
