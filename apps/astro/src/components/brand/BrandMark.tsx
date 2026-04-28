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
      borderColor="#524533"
      bg="#1c1b1b"
    >
      <styled.svg
        style={{ width: `${size - 8}px`, height: `${size - 8}px` }}
        viewBox="0 0 64 64"
        aria-hidden="true"
        fill="none"
      >
        <path d="M18 54L22 12" stroke={color} strokeWidth="3.2" />
        <path d="M46 54L42 12" stroke={color} strokeWidth="3.2" />
        <path d="M22 31H42" stroke={accent} strokeWidth="4" />
        <path d="M26 16H38" stroke={color} strokeWidth="3" />
        <path d="M20 54H44" stroke={color} strokeWidth="3" />
        <path d="M32 8V18" stroke={accent} strokeWidth="3" />
        <circle cx="32" cy="8" r="3" fill={accent} />
      </styled.svg>
    </Box>
  );
};
