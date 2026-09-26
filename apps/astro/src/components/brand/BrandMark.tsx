import { Box } from 'styled-system/jsx';

// A block H held between two framing corners: the builder's initial inside a viewfinder.
// Drawn on a 32-unit grid with crisp edges so it stays sharp at 16px; amber stays the only
// signal colour, so it is spent on the frame, not the letter.
export const BrandMark = () => {
  return (
    <Box
      as="span"
      display="inline-flex"
      gap="2.5"
      alignItems="center"
      color="var(--atelier-fg)"
      fontFamily="var(--font-display)"
      fontSize="23px"
      fontWeight="560"
      letterSpacing="-0.01em"
      lineHeight="1"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        shapeRendering="crispEdges"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <path d="M2 2h9v2H4v7H2zM28 21h2v9h-9v-2h7z" fill="var(--atelier-accent)" />
        <path d="M9 8h4v6h6V8h4v16h-4v-6h-6v6H9z" fill="currentColor" />
      </svg>
      <Box as="span" display={{ base: 'none', sm: 'inline' }}>
        Ham
      </Box>
    </Box>
  );
};
