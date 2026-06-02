import { css } from 'styled-system/css';

export const hobbyStyles = {
  imageHero: css({
    objectFit: 'cover',
    w: 'full',
    h: 'full',
    opacity: '0.9',
    transition: 'filter 0.7s ease, opacity 0.7s ease',
    filter: 'saturate(1.05) contrast(1.03)',
    '.group:hover &': {
      opacity: '1',
      filter: 'saturate(1.24) contrast(1.08)'
    }
  }),
  imageBottom: css({
    objectFit: 'cover',
    w: 'full',
    h: 'full',
    opacity: '0.86',
    transition: 'opacity 0.7s ease',
    filter: 'saturate(1.08) contrast(1.04)',
    '.group:hover &': {
      opacity: '0.98'
    }
  }),
  imageOverlay: css({
    inset: '0',
    pos: 'absolute',
    objectFit: 'cover',
    w: 'full',
    h: 'full',
    opacity: '0.82',
    transition: 'filter 0.7s ease, opacity 0.7s ease',
    filter: 'saturate(1.05) contrast(1.03)',
    '.group:hover &': {
      opacity: '0.94',
      filter: 'saturate(1.24) contrast(1.08)'
    }
  }),
  typeMark: css({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #524533',
    w: '44px',
    h: '44px',
    color: '#ffb000',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    bg: '#131313'
  }),
  inlineMark: css({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #524533',
    minW: '28px',
    h: '28px',
    mr: '2',
    px: '1.5',
    color: '#ffb000',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.62rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    bg: '#131313'
  }),
  fallbackMark: css({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ffb000',
    w: '28',
    h: '28',
    color: '#ffb000',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    bg: 'rgba(255, 176, 0, 0.08)'
  }),
  cameraMark: css({
    '&::before, &::after': {
      zIndex: '2',
      pos: 'absolute',
      bg: '#ffb000',
      content: '""'
    },
    '&::before': {
      top: 'calc(50% - 5.5rem)',
      left: 'calc(50% - 4.5rem)',
      w: '9rem',
      h: '2.25rem'
    },
    '&::after': {
      top: 'calc(50% - 6.75rem)',
      left: 'calc(50% - 2rem)',
      w: '4rem',
      h: '1.5rem'
    }
  }),
  cameraPanel: css({
    inset: '4rem!',
    bg: 'linear-gradient(90deg, transparent 0 48%, rgba(255, 176, 0, 0.26) 48% 52%, transparent 52%), linear-gradient(0deg, transparent 0 48%, rgba(255, 176, 0, 0.26) 48% 52%, transparent 52%)',
    boxShadow: '12px 12px 0 rgba(255, 176, 0, 0.12)'
  }),
  cameraLens: css({
    aspectRatio: '1',
    border: '2px solid rgba(255, 176, 0, 0.82)',
    rounded: 'full',
    w: '18rem!',
    maxW: '54%!',
    bg: 'radial-gradient(circle, transparent 0 28%, rgba(255, 176, 0, 0.85) 29% 31%, transparent 32% 54%, rgba(255, 176, 0, 0.35) 55% 56%, transparent 57%), radial-gradient(circle, rgba(255, 176, 0, 0.12), transparent 62%)'
  }),
  detail: css({
    w: 'min(100%, 1280px)',
    mx: 'auto',
    py: { base: '6', md: '8' },
    px: { base: '4', md: '4' }
  }),
  detailBack: css({
    display: 'inline-flex',
    gap: '2',
    alignItems: 'center',
    minH: '44px',
    color: '#c7c6c6',
    textDecoration: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.75rem',
    _hover: {
      color: '#ffb000'
    }
  }),
  detailHero: css({
    display: 'grid',
    gap: '8',
    alignItems: 'stretch',
    gridTemplateColumns: { base: '1fr', md: 'minmax(0, 7fr) minmax(20rem, 5fr)' },
    mt: { base: '6', md: '10' }
  }),
  detailHeadline: css({
    display: 'grid',
    gap: '6',
    alignContent: 'start',
    borderLeft: '4px solid #ffb000',
    py: '4',
    pl: 'clamp(1.5rem, 4vw, 2rem)'
  }),
  detailEyebrow: css({
    m: '0',
    color: '#2dd4bf',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }),
  detailTitle: css({
    maxW: { base: 'none', md: '11ch' },
    m: '0',
    fontFamily: 'Newsreader, serif',
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    lineHeight: '0.95',
    fontStyle: 'italic'
  }),
  detailDescription: css({
    maxW: '42rem',
    m: '0',
    color: '#c7c6c6',
    fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
    lineHeight: '1.7'
  }),
  detailUpdated: css({
    display: 'flex',
    gap: '2',
    m: '0',
    color: '#9f8e78',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    flexWrap: 'wrap'
  }),
  detailVisual: css({
    pos: 'relative',
    border: '1px solid #524533',
    minH: '16rem',
    bg: '#131313',
    overflow: 'hidden'
  }),
  detailFallback: css({
    inset: '0',
    pos: 'absolute',
    '& span': {
      pos: 'absolute',
      right: '1rem',
      bottom: '-2rem',
      color: '#e5e2e1',
      fontFamily: 'Newsreader, serif',
      fontSize: '11.25rem',
      lineHeight: '1',
      opacity: '0.08',
      fontStyle: 'italic'
    }
  }),
  detailVisualLabel: css({
    pos: 'absolute',
    left: '0',
    right: '0',
    bottom: '0',
    m: '0',
    p: '4',
    color: '#ffb000',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    bg: 'linear-gradient(180deg, transparent, rgba(14, 14, 14, 0.92))'
  }),
  detailBanner: css({
    objectFit: 'cover',
    w: 'full',
    h: 'full',
    minH: '26rem',
    filter: 'saturate(1.12) contrast(1.04) brightness(0.74)'
  }),
  detailBody: css({
    display: 'grid',
    gap: '8',
    gridTemplateColumns: { base: '1fr', md: 'minmax(0, 8fr) minmax(18rem, 4fr)' },
    mt: '8'
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
    minW: '0'
  }),
  detailSurface: css({
    border: '1px solid #524533',
    p: 'clamp(1.5rem, 3vw, 2rem)',
    bg: '#1c1b1b'
  }),
  detailPanel: css({
    border: '1px solid #524533',
    p: 'clamp(1.5rem, 3vw, 2rem)',
    bg: '#131313'
  }),
  detailPanelTitle: css({
    m: '0 0 1rem',
    color: '#ffb000',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }),
  detailPanelTitleCyan: css({
    color: '#2dd4bf'
  }),
  detailNested: css({
    display: 'grid',
    gap: '3',
    '& a': {
      display: 'flex',
      gap: '4',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #524533',
      minH: '44px',
      color: '#c7c6c6',
      textDecoration: 'none'
    },
    '& a:hover, & a[aria-current="page"]': {
      color: '#ffb000'
    },
    '& a span:first-child': {
      overflowWrap: 'anywhere'
    },
    '& a span:last-child': {
      color: '#9f8e78',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }),
  detailMuted: css({
    m: '0',
    color: '#9f8e78',
    fontSize: '0.875rem',
    lineHeight: '1.8'
  }),
  embed: css({
    border: '1px solid #524533',
    p: 'clamp(1.5rem, 3vw, 2.5rem)',
    color: '#e5e2e1',
    bg: 'linear-gradient(135deg, rgba(45, 212, 191, 0.08), transparent 42%), linear-gradient(315deg, rgba(255, 176, 0, 0.08), transparent 46%), #131313'
  }),
  embedHeader: css({
    display: 'flex',
    gap: '6',
    flexDirection: { base: 'column', md: 'row' },
    justifyContent: 'space-between',
    borderBottom: '1px solid #524533',
    pb: '4',
    '& h2': {
      m: '0',
      fontFamily: 'Newsreader, serif',
      fontSize: 'clamp(2rem, 5vw, 3.75rem)',
      lineHeight: '0.95',
      fontStyle: 'italic'
    }
  }),
  embedEyebrow: css({
    m: '0 0 0.75rem',
    color: '#2dd4bf',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }),
  embedMeta: css({
    display: 'flex',
    gap: '2',
    flexDir: 'column',
    alignItems: { base: 'flex-start', md: 'flex-end' },
    color: '#9f8e78',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textAlign: { base: 'left', md: 'right' },
    textTransform: 'uppercase'
  }),
  embedSummary: css({
    maxW: '52rem',
    my: '6',
    color: '#c7c6c6',
    fontSize: '1.05rem',
    lineHeight: '1.7'
  }),
  gallery: css({
    display: 'grid',
    gap: '4',
    gridTemplateColumns: { base: '1fr', md: 'minmax(0, 1fr) 7rem' }
  }),
  galleryStage: css({
    border: '1px solid #524533',
    minH: '22rem',
    bg: '#0e0e0e',
    overflow: 'hidden',
    '& img': {
      objectFit: 'cover',
      w: 'full',
      h: 'full',
      minH: '22rem',
      filter: 'saturate(1.12) contrast(1.04)'
    }
  }),
  galleryFallback: css({
    display: 'grid',
    gap: '3',
    minH: '22rem',
    color: '#ffb000',
    textAlign: 'center',
    placeItems: 'center'
  }),
  galleryRail: css({
    display: 'grid',
    gap: '3',
    gridTemplateColumns: { base: 'repeat(3, 1fr)', md: '1fr' },
    '& button': {
      cursor: 'pointer',
      border: '1px solid #524533',
      minH: '44px',
      color: '#c7c6c6',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: '#131313'
    },
    '& button[data-active="true"]': {
      borderColor: '#ffb000',
      color: '#ffb000'
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
    gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& article': {
      p: '5',
      bg: '#131313'
    },
    '& span': {
      color: '#9f8e78',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& p': {
      mt: '4',
      mb: '0',
      color: '#c7c6c6',
      lineHeight: '1.65'
    }
  }),
  algorithm: css({
    display: 'grid',
    gap: '4',
    gridTemplateColumns: { base: '1fr', md: '15rem minmax(0, 1fr)' }
  }),
  algorithmTabs: css({
    display: 'grid',
    gap: '3',
    '& button': {
      cursor: 'pointer',
      border: '1px solid #524533',
      minH: '44px',
      color: '#c7c6c6',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: '#131313'
    },
    '& button[data-active="true"]': {
      borderColor: '#ffb000',
      color: '#ffb000'
    }
  }),
  algorithmViewer: css({
    border: '1px solid #524533',
    p: 'clamp(1.5rem, 4vw, 3rem)',
    bg: '#0e0e0e',
    '& p': {
      m: '0 0 1rem',
      color: '#ffb000',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 'clamp(1.5rem, 4vw, 3rem)',
      overflowWrap: 'anywhere'
    },
    '& span': {
      color: '#9f8e78',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    }
  }),
  stats: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: '1fr', md: 'repeat(4, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& div': {
      p: '5',
      bg: '#131313'
    },
    '& span': {
      color: '#9f8e78',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& strong': {
      display: 'block',
      mt: '3',
      color: '#2dd4bf',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
    }
  }),
  pianoKeys: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(14, 1fr)',
    border: '1px solid #524533',
    h: '10rem',
    bg: '#e5e2e1',
    overflow: 'hidden',
    '& span': {
      pos: 'relative',
      borderRight: '1px solid #c7c6c6'
    },
    '& span[data-black="true"]::before': {
      inset: '0 18% 44%',
      pos: 'absolute',
      bg: '#131313',
      content: '""'
    }
  }),
  pianoControls: css({
    display: 'grid',
    gap: '3',
    gridTemplateColumns: { base: '1fr', md: 'repeat(4, 1fr)' },
    mt: '4',
    '& button': {
      cursor: 'pointer',
      border: '1px solid #524533',
      minH: '44px',
      color: '#c7c6c6',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: '#131313',
      _hover: {
        borderColor: '#ffb000',
        color: '#ffb000'
      }
    }
  }),
  pianoStatus: css({
    color: '#9f8e78',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }),
  fieldNotes: css({
    display: 'grid',
    gap: '3',
    minH: '22rem',
    color: '#ffb000',
    textAlign: 'center',
    placeItems: 'center'
  })
};
