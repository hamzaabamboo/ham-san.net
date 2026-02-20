import type { CSSProperties, ReactNode } from 'react';
import { Box } from 'styled-system/jsx';

const profileBackTextStyle = {
  WebkitTextStroke: '0.5mm rgba(255, 255, 255, 0.95)',
  paintOrder: 'stroke fill'
} as const;

export const ProfileText = ({
  children,
  color,
  fontSize,
  style = {}
}: {
  children: ReactNode;
  color?: string;
  fontSize?: string;
  style?: CSSProperties;
}) => (
  <Box
    style={{ ...profileBackTextStyle, ...style }}
    color={color ?? 'var(--main-color)'}
    fontSize={fontSize ?? '2mm'}
    fontWeight="bold"
    whiteSpace="nowrap"
  >
    {children}
  </Box>
);
