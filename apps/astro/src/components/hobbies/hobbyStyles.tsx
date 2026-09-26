import { css } from 'styled-system/css';

export const hobbyStyles = {
  detail: css({
    w: 'min(100%, 1280px)',
    minH: { md: '70vh' },
    mx: 'auto',
    py: { base: '6', md: '8' },
    // Matches the content inset every other route uses; 16px put the whole hobby detail
    // column 16px left of the site's edge, so navigating into a hobby shifted the page.
    px: { base: '4', md: '8' }
  }),
  detailBack: css({
    display: 'inline-flex',
    gap: '2',
    alignItems: 'center',
    minH: '44px',
    color: 'var(--atelier-fg-muted)',
    textDecoration: 'none',
    fontFamily: 'var(--font-code)',
    fontSize: '0.75rem',
    _hover: {
      color: 'var(--atelier-accent)'
    }
  }),
  detailHero: css({
    display: 'grid',
    gap: '8',
    alignItems: 'stretch',
    // Same right-hand track as `detailBody`: at 7fr/5fr and 1fr/18rem the hero panel and
    // the rail under it started 75px apart — a vertical seam that does not line up.
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 22rem' },
    mt: { base: '6', md: '10' },
    '&[data-visual="glyph"]': {
      gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 22rem' }
    }
  }),
  detailHeadline: css({
    display: 'grid',
    gap: '6',
    alignContent: 'start',
    // The rule hangs in the gutter so the h1 lands on the content edge, as on every other
    // page header.
    borderLeft: '4px solid var(--atelier-line)',
    ml: 'calc(-1.5rem - 4px)',
    py: '4',
    pl: '1.5rem'
  }),
  detailEyebrow: css({
    m: '0',
    color: 'var(--atelier-outline)',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    '&[data-status="inactive"]': {
      color: 'var(--atelier-outline)'
    }
  }),
  detailTitle: css({
    maxW: { base: 'none', md: '11ch' },
    m: '0',
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    lineHeight: '0.95'
  }),
  detailDescription: css({
    maxW: '42rem',
    m: '0',
    color: 'var(--atelier-fg-muted)',
    fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
    lineHeight: '1.7'
  }),
  detailUpdated: css({
    display: 'flex',
    gap: '2',
    m: '0',
    color: 'var(--atelier-outline)',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    flexWrap: 'wrap'
  }),
  detailVisual: css({
    display: 'grid',
    pos: 'relative',
    border: '1px solid var(--atelier-line)',
    minH: { base: '18rem', md: '26rem' },
    bg: 'var(--atelier-bg)',
    overflow: 'hidden',
    placeItems: 'center',
    '&[data-visual="glyph"]': {
      display: { base: 'none', md: 'grid' },
      minH: '0'
    },
    '&[data-visual="glyph"]::before': {
      inset: '0',
      pos: 'absolute',
      bg: 'linear-gradient(90deg, rgba(229, 226, 225, 0.11) 1px, transparent 1px), linear-gradient(180deg, rgba(229, 226, 225, 0.1) 1px, transparent 1px)',
      backgroundSize: '3.75rem 3.75rem',
      content: '""',
      maskImage: 'linear-gradient(135deg, black, transparent 78%)'
    },
    '&[data-visual="glyph"]::after': {
      inset: '12%',
      pos: 'absolute',
      border: '1px solid rgba(229, 226, 225, 0.72)',
      content: '""'
    },
    '&[data-embed="photo-gallery"]': {
      bg: 'radial-gradient(circle at 50% 50%, rgba(229, 226, 225, 0.18), transparent 38%), linear-gradient(135deg, rgba(229, 226, 225, 0.1), transparent 50%), var(--atelier-bg)'
    },
    '&[data-embed="photo-gallery"][data-visual="glyph"]::after': {
      rounded: 'full',
      boxShadow:
        'inset 0 0 0 2.25rem rgba(229, 226, 225, 0.08), 0 0 0 5rem rgba(229, 226, 225, 0.04)'
    },
    '&[data-embed="twitter-feed"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'radial-gradient(circle at 74% 20%, rgba(229, 226, 225, 0.14), transparent 34%), var(--atelier-bg)'
    },
    '&[data-embed="twitter-feed"][data-visual="glyph"]::after': {
      inset: '18% 12%',
      transform: 'skewX(-8deg)',
      borderColor: 'rgba(229, 226, 225, 0.64)'
    },
    '&[data-embed="rubik-algorithms"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'linear-gradient(135deg, rgba(229, 226, 225, 0.14), transparent 36%), linear-gradient(315deg, rgba(229, 226, 225, 0.08), transparent 48%), var(--atelier-bg)'
    },
    '&[data-embed="rubik-algorithms"][data-visual="glyph"]::after': {
      borderColor: 'rgba(229, 226, 225, 0.64)',
      boxShadow: '4rem 0 0 rgba(229, 226, 225, 0.1), 0 4rem 0 rgba(229, 226, 225, 0.08)'
    },
    '&[data-embed="typing-stats"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'linear-gradient(135deg, rgba(229, 226, 225, 0.14), transparent 42%), linear-gradient(315deg, rgba(229, 226, 225, 0.1), transparent 46%), var(--atelier-bg)'
    },
    '&[data-embed="typing-stats"][data-visual="glyph"]::after': {
      inset: 'auto 12% 18%',
      borderColor: 'rgba(229, 226, 225, 0.66)',
      borderTop: '0',
      h: '34%'
    },
    '&[data-embed="darts-board"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'radial-gradient(circle at 50% 50%, rgba(229, 226, 225, 0.16), transparent 34%), var(--atelier-bg)'
    },
    '&[data-embed="darts-board"][data-visual="glyph"]::after': {
      borderColor: 'rgba(229, 226, 225, 0.7)',
      rounded: 'full',
      boxShadow:
        'inset 0 0 0 2rem rgba(229, 226, 225, 0.05), inset 0 0 0 4rem rgba(229, 226, 225, 0.07)'
    },
    '&[data-embed="link-library"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'linear-gradient(135deg, rgba(229, 226, 225, 0.12), transparent 44%), var(--atelier-bg)'
    },
    '&[data-embed="link-library"][data-visual="glyph"]::after': {
      inset: '18%',
      transform: 'rotate(45deg)',
      borderColor: 'rgba(229, 226, 225, 0.62)'
    },
    '&[data-embed="piano-chords"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'linear-gradient(135deg, rgba(229, 226, 225, 0.08), transparent 36%), linear-gradient(315deg, rgba(229, 226, 225, 0.12), transparent 48%), var(--atelier-bg)'
    },
    '&[data-embed="piano-chords"][data-visual="glyph"]::after': {
      inset: '18% 12%',
      borderColor: 'rgba(229, 226, 225, 0.62)',
      boxShadow:
        'inset 1.25rem 0 0 rgba(229, 226, 225, 0.06), inset 2.5rem 0 0 rgba(19, 19, 19, 0.7), inset 3.75rem 0 0 rgba(229, 226, 225, 0.06)'
    },
    '&[data-embed="field-notes"]': {
      borderColor: 'var(--atelier-line)',
      bg: 'linear-gradient(135deg, rgba(229, 226, 225, 0.12), transparent 40%), linear-gradient(315deg, rgba(229, 226, 225, 0.08), transparent 48%), var(--atelier-bg)'
    },
    '&[data-embed="field-notes"][data-visual="glyph"]::after': {
      inset: '14% 20%',
      borderColor: 'rgba(229, 226, 225, 0.64)'
    }
  }),
  detailBanner: css({
    objectFit: 'cover',
    w: 'full',
    h: 'full',
    minH: '26rem',
    filter: 'var(--atelier-image-rest)'
  }),
  detailVisualLettermark: css({
    zIndex: '1',
    pos: 'relative',
    color: 'var(--atelier-fg-muted)',
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(4rem, 10vw, 7rem)',
    lineHeight: '1',
    opacity: '0.3',
    userSelect: 'none',
    fontStyle: 'italic'
  }),
  detailBody: css({
    display: 'grid',
    gap: '8',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 22rem' },
    mt: '8',
    '&[data-has-aside="false"]': {
      gridTemplateColumns: 'minmax(0, 1fr)'
    }
  }),
  detailMain: css({
    display: 'grid',
    gap: '8',
    minW: '0'
  }),
  detailAside: css({
    display: 'grid',
    gap: '6',
    alignContent: 'start',
    alignSelf: 'start',
    minW: '0',
    md: {
      pos: 'sticky',
      // Clears the 64px fixed header; at 24px the panel sat behind it, clipped.
      top: '24'
    }
  }),
  detailSurface: css({
    border: '1px solid var(--atelier-line)',
    minW: '0',
    p: 'clamp(1.5rem, 3vw, 2rem)',
    bg: 'var(--atelier-surface-low)'
  }),
  detailPanel: css({
    border: '1px solid var(--atelier-line)',
    p: 'clamp(1.5rem, 3vw, 2rem)',
    bg: 'var(--atelier-bg)'
  }),
  detailPanelTitle: css({
    m: '0 0 1rem',
    color: 'var(--atelier-outline)',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }),
  detailNested: css({
    display: 'grid',
    gap: '3',
    '& a': {
      display: 'flex',
      gap: '4',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--atelier-line)',
      minH: '44px',
      color: 'var(--atelier-fg-muted)',
      textDecoration: 'none'
    },
    '& a:hover, & a[aria-current="page"]': {
      color: 'var(--atelier-accent)'
    },
    '& a span:first-child': {
      overflowWrap: 'anywhere'
    },
    '& a span:last-child': {
      color: 'var(--atelier-outline)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }),
  embed: css({
    pos: 'relative',
    border: '1px solid var(--atelier-line)',
    minW: '0',
    p: 'clamp(1.5rem, 3vw, 2.5rem)',
    color: 'var(--atelier-fg)',
    bg: 'linear-gradient(135deg, rgba(255, 176, 0, 0.06), transparent 46%), var(--atelier-bg)',
    overflow: 'hidden',
    '&::before': {
      inset: '0 auto 0 0',
      pos: 'absolute',
      w: '4px',
      bg: 'var(--atelier-accent)',
      content: '""'
    },
    '&[data-status="inactive"]': {
      borderColor: 'var(--atelier-surface-highest)',
      bg: 'var(--atelier-surface-lowest)',
      '&::before': {
        bg: 'var(--atelier-outline)'
      }
    }
  }),
  embedHeader: css({
    borderBottom: '1px solid var(--atelier-line)',
    pb: '4',
    '& h2': {
      m: '0',
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(2rem, 5vw, 3.75rem)',
      lineHeight: '0.95'
    }
  }),
  embedSummary: css({
    maxW: '52rem',
    my: '6',
    color: 'var(--atelier-fg-muted)',
    fontSize: '1.05rem',
    lineHeight: '1.7'
  }),
  gallery: css({
    display: 'grid',
    gap: '4',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 7rem' },
    '&[data-has-rail="false"]': {
      gridTemplateColumns: 'minmax(0, 1fr)'
    }
  }),
  galleryStage: css({
    border: '1px solid var(--atelier-line)',
    minH: '22rem',
    bg: 'var(--atelier-surface-lowest)',
    overflow: 'hidden',
    '& img': {
      objectFit: 'cover',
      w: 'full',
      h: 'full',
      minH: '22rem',
      filter: 'var(--atelier-image-rest)'
    }
  }),
  galleryFallback: css({
    display: 'grid',
    gap: '3',
    minH: '22rem',
    color: 'var(--atelier-accent)',
    textAlign: 'center',
    placeItems: 'center'
  }),
  gallerySources: css({
    display: 'grid',
    gap: '4',
    alignContent: 'center',
    minH: '22rem',
    p: '6',
    color: 'var(--atelier-accent)',
    textAlign: 'center',
    '& strong': {
      color: 'var(--atelier-fg)',
      fontSize: '1rem'
    },
    '& div': {
      display: 'grid',
      gap: '2',
      mt: '2'
    },
    '& a': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid var(--atelier-line)',
      minH: '44px',
      px: '3',
      color: 'var(--atelier-accent)',
      textDecoration: 'none',
      fontFamily: 'var(--font-code)',
      fontSize: '11px',
      letterSpacing: '0.02em',
      overflowWrap: 'anywhere',
      _hover: {
        borderColor: 'var(--atelier-accent)',
        bg: 'rgba(255, 176, 0, 0.08)'
      }
    }
  }),
  galleryRail: css({
    display: 'grid',
    gap: '3',
    gridTemplateColumns: { base: 'repeat(3, minmax(0, 1fr))', md: 'minmax(0, 1fr)' },
    '& button': {
      cursor: 'pointer',
      border: '1px solid var(--atelier-line)',
      minH: '44px',
      color: 'var(--atelier-fg-muted)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: 'var(--atelier-bg)'
    },
    '& button[data-active="true"]': {
      borderColor: 'var(--atelier-accent)',
      color: 'var(--atelier-accent)'
    },
    '& img': {
      objectFit: 'cover',
      w: 'full',
      h: '5rem'
    }
  }),
  feed: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
    border: '1px solid var(--atelier-line)',
    bg: 'var(--atelier-line)',
    '& article': {
      p: '5',
      bg: 'var(--atelier-bg)'
    },
    '& span': {
      color: 'var(--atelier-outline)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& p': {
      mt: '4',
      mb: '0',
      color: 'var(--atelier-fg-muted)',
      lineHeight: '1.65'
    },
    '& a': {
      color: 'var(--atelier-accent)',
      textDecoration: 'none',
      overflowWrap: 'anywhere',
      _hover: {
        color: 'var(--atelier-fg)'
      }
    }
  }),
  algorithmShell: css({
    display: 'grid',
    gap: '4'
  }),
  algorithm: css({
    display: 'grid',
    gap: '4',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '15rem minmax(0, 1fr)' }
  }),
  algorithmTabs: css({
    display: 'grid',
    gap: '3',
    '& button': {
      cursor: 'pointer',
      border: '1px solid var(--atelier-line)',
      minH: '44px',
      color: 'var(--atelier-fg-muted)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: 'var(--atelier-bg)'
    },
    '& button[data-active="true"]': {
      borderColor: 'var(--atelier-accent)',
      color: 'var(--atelier-accent)'
    }
  }),
  algorithmViewer: css({
    border: '1px solid var(--atelier-line)',
    p: 'clamp(1.5rem, 4vw, 3rem)',
    bg: 'var(--atelier-surface-lowest)',
    '& p': {
      m: '0 0 1rem',
      color: 'var(--atelier-accent)',
      fontFamily: 'var(--font-code)',
      fontSize: 'clamp(1.5rem, 4vw, 3rem)',
      overflowWrap: 'anywhere'
    },
    '& span': {
      color: 'var(--atelier-outline)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& a': {
      display: 'inline-flex',
      alignItems: 'center',
      minH: '44px',
      mt: '6',
      color: 'var(--atelier-accent)',
      textDecoration: 'none',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      _hover: {
        color: 'var(--atelier-fg)'
      }
    }
  }),
  algorithmResources: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
    border: '1px solid var(--atelier-line)',
    bg: 'var(--atelier-line)',
    '& a': {
      display: 'grid',
      gap: '2',
      minH: '44px',
      p: '4',
      color: 'var(--atelier-fg-muted)',
      textDecoration: 'none',
      bg: 'var(--atelier-bg)',
      _hover: {
        color: 'var(--atelier-accent)',
        bg: 'var(--atelier-surface-low)'
      }
    },
    '& a:last-of-type:nth-of-type(odd)': {
      gridColumn: { md: '1 / -1' }
    },
    '& span': {
      color: 'var(--atelier-accent)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& strong': {
      fontSize: 'sm',
      fontWeight: 'normal',
      overflowWrap: 'anywhere'
    }
  }),
  sourceModule: css({
    display: 'grid',
    gap: '4'
  }),
  sourceLinks: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
    border: '1px solid var(--atelier-line)',
    bg: 'var(--atelier-line)',
    '& a': {
      display: 'grid',
      gap: '2',
      minH: '44px',
      p: '4',
      color: 'var(--atelier-fg-muted)',
      textDecoration: 'none',
      bg: 'var(--atelier-surface-lowest)',
      _hover: {
        color: 'var(--atelier-accent)',
        bg: 'var(--atelier-surface-low)'
      }
    },
    '& a:last-of-type:nth-of-type(odd)': {
      gridColumn: { md: '1 / -1' }
    },
    '& span': {
      color: 'var(--atelier-accent)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      overflowWrap: 'anywhere'
    },
    '& strong': {
      fontSize: 'sm',
      fontWeight: 'normal',
      overflowWrap: 'anywhere'
    }
  }),
  sourceEmpty: css({
    border: '1px solid var(--atelier-line)',
    m: '0',
    p: '5',
    color: 'var(--atelier-outline)',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    bg: 'var(--atelier-bg)'
  }),
  dartsBoard: css({
    display: 'grid',
    gap: '4',
    alignItems: 'stretch',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '16rem minmax(0, 1fr)' }
  }),
  dartsTarget: css({
    pos: 'relative',
    border: '1px solid var(--atelier-line)',
    minH: '16rem',
    bg: 'var(--atelier-surface-lowest)',
    overflow: 'hidden',
    '&::before': {
      inset: '1.5rem',
      pos: 'absolute',
      border: '2px solid var(--atelier-accent)',
      rounded: 'full',
      boxShadow:
        'inset 0 0 0 1.5rem rgba(255, 176, 0, 0.08), inset 0 0 0 3rem var(--atelier-bg), inset 0 0 0 3.25rem var(--atelier-accent-soft)',
      content: '""'
    },
    '& span': {
      pos: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: '50% 0',
      w: '2px',
      h: '44%',
      bg: 'var(--atelier-line)'
    },
    '& span:nth-child(1)': {
      transform: 'rotate(0deg)'
    },
    '& span:nth-child(2)': {
      transform: 'rotate(60deg)'
    },
    '& span:nth-child(3)': {
      transform: 'rotate(120deg)'
    }
  }),
  dartsStats: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
    border: '1px solid var(--atelier-line)',
    bg: 'var(--atelier-line)',
    '& div': {
      p: '5',
      bg: 'var(--atelier-bg)'
    },
    '& span': {
      color: 'var(--atelier-outline)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& strong': {
      display: 'block',
      mt: '3',
      color: 'var(--atelier-accent)',
      fontFamily: 'var(--font-code)',
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      whiteSpace: 'nowrap'
    }
  }),
  dartsGear: css({
    display: 'grid',
    gap: '1px',
    gridColumn: { lg: '1 / -1' },
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
    border: '1px solid var(--atelier-line)',
    bg: 'var(--atelier-line)',
    '& section': {
      p: '5',
      bg: 'var(--atelier-surface-lowest)'
    },
    '& span': {
      color: 'var(--atelier-outline)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& p': {
      m: '0.75rem 0 0',
      color: 'var(--atelier-fg-muted)',
      lineHeight: '1.5',
      overflowWrap: 'anywhere'
    }
  }),
  linkLibrary: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
    border: '1px solid var(--atelier-line)',
    bg: 'var(--atelier-line)',
    '& a': {
      display: 'grid',
      gap: '2',
      minH: '44px',
      p: '5',
      color: 'var(--atelier-fg-muted)',
      textDecoration: 'none',
      bg: 'var(--atelier-bg)',
      _hover: {
        color: 'var(--atelier-accent)',
        bg: 'var(--atelier-surface-low)'
      }
    },
    '& a:last-of-type:nth-of-type(odd)': {
      gridColumn: { md: '1 / -1' }
    },
    '& span': {
      color: 'var(--atelier-accent)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& strong': {
      color: 'var(--atelier-fg)',
      fontWeight: 'normal',
      overflowWrap: 'anywhere'
    },
    '& small': {
      color: 'var(--atelier-outline)',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      overflowWrap: 'anywhere'
    },
    '& p': {
      gridColumn: '1 / -1',
      m: '0',
      p: '5',
      color: 'var(--atelier-outline)',
      bg: 'var(--atelier-bg)'
    }
  }),
  pianoKeys: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(14, minmax(0, 1fr))',
    border: '1px solid var(--atelier-line)',
    h: '10rem',
    bg: 'var(--atelier-fg)',
    overflow: 'hidden',
    '& span': {
      pos: 'relative',
      borderRight: '1px solid var(--atelier-fg-muted)'
    },
    '& span[data-black="true"]::before': {
      inset: '0 18% 44%',
      pos: 'absolute',
      bg: 'var(--atelier-bg)',
      content: '""'
    }
  }),
  pianoControls: css({
    display: 'grid',
    gap: '3',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(4, minmax(0, 1fr))' },
    mt: '4',
    '& button, & a': {
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid var(--atelier-line)',
      minH: '44px',
      color: 'var(--atelier-fg-muted)',
      textDecoration: 'none',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: 'var(--atelier-bg)',
      _hover: {
        borderColor: 'var(--atelier-accent)',
        color: 'var(--atelier-accent)'
      }
    }
  }),
  pianoStatus: css({
    color: 'var(--atelier-outline)',
    fontFamily: 'var(--font-code)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }),
  fieldNotes: css({
    display: 'grid',
    gap: '5',
    minH: '22rem',
    p: '6',
    color: 'var(--atelier-accent)',
    textAlign: 'center',
    placeItems: 'center',
    '& p': {
      m: '0',
      color: 'var(--atelier-fg)',
      fontSize: 'lg'
    },
    '& strong': {
      display: 'block',
      mt: '2',
      color: 'var(--atelier-accent)',
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(1.4rem, 4vw, 2.5rem)',
      letterSpacing: '0',
      lineHeight: '1',
      textTransform: 'none'
    },
    '& nav': {
      display: 'flex',
      gap: '2',
      justifyContent: 'center',
      mt: '5',
      flexWrap: 'wrap'
    },
    '& nav a': {
      display: 'inline-flex',
      alignItems: 'center',
      border: '1px solid var(--atelier-line)',
      minH: '44px',
      px: '4',
      color: 'var(--atelier-fg-muted)',
      textDecoration: 'none',
      fontFamily: 'var(--font-code)',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: 'var(--atelier-bg)',
      _hover: {
        borderColor: 'var(--atelier-accent)',
        color: 'var(--atelier-accent)'
      }
    }
  })
};
