import { Box, styled } from 'styled-system/jsx';

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
      style={{ width: `${size}px`, height: `${size}px` }}
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      border="1px solid"
      borderColor="border.subtle"
      bg="bg.default"
    >
      <styled.svg
        style={{ width: `${size - 8}px`, height: `${size - 8}px` }}
        viewBox="0 0 64 64"
        aria-hidden="true"
        fill="none"
      >
        <path d="M12 52L26 12H30L20 52H12Z" stroke={color} strokeWidth="3" />
        <path d="M52 52L38 12H34L44 52H52Z" stroke={color} strokeWidth="3" />
        <path d="M24 33H40" stroke={accent} strokeWidth="4" />
        <path d="M30 12L40 12" stroke={accent} strokeWidth="3" />
        <path d="M22 52H42" stroke={color} strokeWidth="3" />
        <circle cx="32" cy="12" r="3" fill={accent} />
      </styled.svg>
    </Box>
  );
};
