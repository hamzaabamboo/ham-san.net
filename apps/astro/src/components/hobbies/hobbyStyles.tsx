import { css } from 'styled-system/css';

export const hobbyStyles = {
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
    mt: { base: '6', md: '10' },
    '&[data-has-visual="false"]': {
      gridTemplateColumns: '1fr'
    }
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
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    lineHeight: '0.95'
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
    pos: 'relative',
    border: '1px solid #524533',
    p: 'clamp(1.5rem, 3vw, 2.5rem)',
    color: '#e5e2e1',
    bg: 'linear-gradient(135deg, rgba(45, 212, 191, 0.08), transparent 42%), linear-gradient(315deg, rgba(255, 176, 0, 0.08), transparent 46%), #131313',
    overflow: 'hidden',
    '&::before': {
      inset: '0 auto 0 0',
      pos: 'absolute',
      w: '4px',
      bg: '#2dd4bf',
      content: '""'
    },
    '&[data-embed="photo-gallery"]': {
      borderColor: '#765c2f',
      bg: 'radial-gradient(circle at 18% 0%, rgba(245, 158, 11, 0.22), transparent 34%), linear-gradient(135deg, rgba(255, 176, 0, 0.1), transparent 48%), #15120d',
      '&::before': {
        bg: '#f59e0b'
      }
    },
    '&[data-embed="twitter-feed"]': {
      borderColor: '#25576a',
      bg: 'radial-gradient(circle at 82% 8%, rgba(56, 189, 248, 0.18), transparent 32%), linear-gradient(135deg, rgba(14, 165, 233, 0.1), transparent 48%), #0d1417',
      '&::before': {
        bg: '#38bdf8'
      }
    },
    '&[data-embed="rubik-algorithms"]': {
      borderColor: '#5d3348',
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.16), transparent 36%), linear-gradient(225deg, rgba(34, 197, 94, 0.12), transparent 42%), linear-gradient(315deg, rgba(59, 130, 246, 0.12), transparent 48%), #130f12',
      '&::before': {
        bg: '#ef4444'
      }
    },
    '&[data-embed="typing-stats"]': {
      borderColor: '#275e58',
      bg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.16), transparent 42%), linear-gradient(315deg, rgba(99, 102, 241, 0.12), transparent 46%), #0c1414',
      '&::before': {
        bg: '#14b8a6'
      }
    },
    '&[data-embed="darts-board"]': {
      borderColor: '#4f5f32',
      bg: 'radial-gradient(circle at 75% 15%, rgba(132, 204, 22, 0.14), transparent 34%), linear-gradient(135deg, rgba(220, 38, 38, 0.1), transparent 42%), #11140d',
      '&::before': {
        bg: '#84cc16'
      }
    },
    '&[data-embed="link-library"]': {
      borderColor: '#345b6f',
      bg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), transparent 44%), linear-gradient(315deg, rgba(250, 204, 21, 0.1), transparent 46%), #0f1418',
      '&::before': {
        bg: '#38bdf8'
      }
    },
    '&[data-embed="piano-chords"]': {
      borderColor: '#5b526d',
      bg: 'linear-gradient(135deg, rgba(250, 250, 240, 0.11), transparent 36%), linear-gradient(315deg, rgba(168, 85, 247, 0.14), transparent 48%), #131119',
      '&::before': {
        bg: '#c4b5fd'
      }
    },
    '&[data-embed="field-notes"]': {
      borderColor: '#5d4d34',
      bg: 'linear-gradient(135deg, rgba(255, 176, 0, 0.12), transparent 40%), linear-gradient(315deg, rgba(45, 212, 191, 0.07), transparent 48%), #121110',
      '&::before': {
        bg: '#ffb000'
      }
    },
    '&[data-status="inactive"]': {
      borderColor: '#4b453d',
      bg: 'linear-gradient(135deg, rgba(159, 142, 120, 0.12), transparent 44%), #111111',
      '&::before': {
        bg: '#9f8e78'
      }
    }
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
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(2rem, 5vw, 3.75rem)',
      lineHeight: '0.95'
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
    gridTemplateColumns: { base: '1fr', md: 'minmax(0, 1fr) 7rem' },
    '&[data-has-rail="false"]': {
      gridTemplateColumns: '1fr'
    }
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
  gallerySources: css({
    display: 'grid',
    gap: '4',
    alignContent: 'center',
    minH: '22rem',
    p: '6',
    color: '#ffb000',
    textAlign: 'center',
    '& strong': {
      color: '#e5e2e1',
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
      border: '1px solid #524533',
      minH: '44px',
      color: '#ffb000',
      textDecoration: 'none',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      _hover: {
        borderColor: '#ffb000',
        bg: 'rgba(255, 176, 0, 0.08)'
      }
    }
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
    },
    '& a': {
      color: '#ffb000',
      textDecoration: 'none',
      overflowWrap: 'anywhere',
      _hover: {
        color: '#e5e2e1'
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
    },
    '& a': {
      display: 'inline-flex',
      alignItems: 'center',
      minH: '44px',
      mt: '6',
      color: '#ffb000',
      textDecoration: 'none',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      _hover: {
        color: '#e5e2e1'
      }
    }
  }),
  algorithmResources: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& a': {
      display: 'grid',
      gap: '2',
      minH: '44px',
      p: '4',
      color: '#c7c6c6',
      textDecoration: 'none',
      bg: '#131313',
      _hover: {
        color: '#ffb000',
        bg: '#1c1b1b'
      }
    },
    '& a:last-of-type:nth-of-type(odd)': {
      gridColumn: { md: '1 / -1' }
    },
    '& span': {
      color: '#ffb000',
      fontFamily: 'JetBrains Mono, monospace',
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
  sourceModule: css({
    display: 'grid',
    gap: '4'
  }),
  sourceStats: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: '1fr', md: 'repeat(4, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& div': {
      minW: '0',
      p: '4',
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
      mt: '2',
      color: '#2dd4bf',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      overflowWrap: 'anywhere'
    }
  }),
  sourceLinks: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& a': {
      display: 'grid',
      gap: '2',
      minH: '44px',
      p: '4',
      color: '#c7c6c6',
      textDecoration: 'none',
      bg: '#0e0e0e',
      _hover: {
        color: '#ffb000',
        bg: '#1c1b1b'
      }
    },
    '& a:last-of-type:nth-of-type(odd)': {
      gridColumn: { md: '1 / -1' }
    },
    '& span': {
      color: '#ffb000',
      fontFamily: 'JetBrains Mono, monospace',
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
    border: '1px solid #524533',
    m: '0',
    p: '5',
    color: '#9f8e78',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    bg: '#131313'
  }),
  dartsBoard: css({
    display: 'grid',
    gap: '4',
    alignItems: 'stretch',
    gridTemplateColumns: { base: '1fr', lg: '16rem minmax(0, 1fr)' }
  }),
  dartsTarget: css({
    pos: 'relative',
    border: '1px solid #524533',
    minH: '16rem',
    bg: '#0e0e0e',
    overflow: 'hidden',
    '&::before': {
      inset: '1.5rem',
      pos: 'absolute',
      border: '2px solid #ffb000',
      rounded: 'full',
      boxShadow:
        'inset 0 0 0 1.5rem rgba(255, 176, 0, 0.08), inset 0 0 0 3rem #131313, inset 0 0 0 3.25rem #2dd4bf',
      content: '""'
    },
    '& span': {
      pos: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: '50% 0',
      w: '2px',
      h: '44%',
      bg: '#524533'
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
    gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
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
      color: '#ffb000',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      whiteSpace: 'nowrap'
    }
  }),
  dartsGear: css({
    display: 'grid',
    gap: '1px',
    gridColumn: { lg: '1 / -1' },
    gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& section': {
      p: '5',
      bg: '#0e0e0e'
    },
    '& span': {
      color: '#2dd4bf',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& p': {
      m: '0.75rem 0 0',
      color: '#c7c6c6',
      lineHeight: '1.5',
      overflowWrap: 'anywhere'
    }
  }),
  linkLibrary: css({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
    border: '1px solid #524533',
    bg: '#524533',
    '& a': {
      display: 'grid',
      gap: '2',
      minH: '44px',
      p: '5',
      color: '#c7c6c6',
      textDecoration: 'none',
      bg: '#131313',
      _hover: {
        color: '#ffb000',
        bg: '#1c1b1b'
      }
    },
    '& a:last-of-type:nth-of-type(odd)': {
      gridColumn: { md: '1 / -1' }
    },
    '& span': {
      color: '#ffb000',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& strong': {
      color: '#e5e2e1',
      fontWeight: 'normal',
      overflowWrap: 'anywhere'
    },
    '& small': {
      color: '#9f8e78',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      overflowWrap: 'anywhere'
    },
    '& p': {
      gridColumn: '1 / -1',
      m: '0',
      p: '5',
      color: '#9f8e78',
      bg: '#131313'
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
    '& button, & a': {
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #524533',
      minH: '44px',
      color: '#c7c6c6',
      textDecoration: 'none',
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
    gap: '5',
    minH: '22rem',
    p: '6',
    color: '#ffb000',
    textAlign: 'center',
    placeItems: 'center',
    '& p': {
      m: '0',
      color: '#e5e2e1',
      fontSize: 'lg'
    },
    '& strong': {
      display: 'block',
      mt: '2',
      color: '#ffb000',
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
      border: '1px solid #524533',
      minH: '44px',
      px: '4',
      color: '#c7c6c6',
      textDecoration: 'none',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      bg: '#131313',
      _hover: {
        borderColor: '#ffb000',
        color: '#ffb000'
      }
    },
    '& dl': {
      display: 'grid',
      gap: '1px',
      gridTemplateColumns: { base: '1fr', md: 'repeat(4, 1fr)' },
      border: '1px solid #524533',
      w: 'full',
      maxW: '46rem',
      m: '0',
      textAlign: 'left',
      bg: '#524533'
    },
    '& dl div': {
      p: '4',
      bg: '#131313'
    },
    '& dt': {
      color: '#9f8e78',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase'
    },
    '& dd': {
      display: 'block',
      ml: '0',
      mt: '2',
      color: '#2dd4bf',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
      textTransform: 'uppercase',
      overflowWrap: 'anywhere'
    }
  })
};
