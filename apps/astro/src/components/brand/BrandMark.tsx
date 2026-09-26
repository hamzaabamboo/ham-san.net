import { Box } from 'styled-system/jsx';

// Drawn as axis-aligned rectangles on a 32-unit grid so every edge lands on a pixel
// boundary at the 32px size it actually renders at. The previous mark was a 96x96 raster
// with ~1px strokes downsampled 3x, which put every stroke near a third of a pixel and read
// as an amber smudge — and its compasses emblem carried semantics the site does not intend.
// Two piers and a lintel: the initial and a structure, in the system's own vocabulary.
export const BrandMark = () => {
  return (
    <Box
      as="span"
      display="inline-flex"
      gap="2"
      alignItems="center"
      color="var(--atelier-fg-muted)"
      fontFamily="var(--font-code)"
      fontSize="12px"
      fontWeight="700"
      letterSpacing="0.12em"
      lineHeight="1"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        role="img"
        aria-label="Ham"
        shapeRendering="crispEdges"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <rect x="6" y="4" width="5" height="21" fill="currentColor" />
        <rect x="21" y="4" width="5" height="21" fill="currentColor" />
        <rect x="6" y="12" width="20" height="5" fill="var(--atelier-accent)" />
        <rect x="3" y="27" width="26" height="2" fill="var(--atelier-outline)" />
      </svg>
      <Box as="span" display={{ base: 'none', sm: 'inline' }}>
        HAM
      </Box>
    </Box>
  );
};
