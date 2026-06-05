import type { ReactNode } from 'react';
import { css, cx } from 'styled-system/css';

type HobbyTypeGlyphProps = {
  type?: string;
  label?: string;
  size?: 'inline' | 'badge' | 'hero' | 'watermark';
  className?: string;
};

const shell = css({
  display: 'inline-grid',
  flexShrink: '0',
  border: '1px solid #524533',
  color: '#ffb000',
  bg: 'rgba(19, 19, 19, 0.92)',
  boxShadow: 'inset 0 0 0 1px rgba(255, 176, 0, 0.08)',
  placeItems: 'center',
  '&[data-size="inline"]': {
    w: '28px',
    h: '28px',
    mr: '2'
  },
  '&[data-size="badge"]': {
    w: '44px',
    h: '44px'
  },
  '&[data-size="hero"]': {
    borderColor: '#ffb000',
    w: { base: '8.5rem', md: '12rem' },
    h: { base: '8.5rem', md: '12rem' },
    bg: 'rgba(14, 14, 14, 0.68)',
    boxShadow: '12px 12px 0 rgba(255, 176, 0, 0.12)'
  },
  '&[data-size="watermark"]': {
    border: '0',
    w: { base: '9rem', md: '14rem' },
    h: { base: '9rem', md: '14rem' },
    bg: 'transparent',
    opacity: '0.18',
    boxShadow: 'none'
  }
});

const svg = css({
  display: 'block',
  w: '74%',
  h: '74%',
  overflow: 'visible',
  '& [data-stroke]': {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
    stroke: 'currentColor',
    vectorEffect: 'non-scaling-stroke'
  },
  '& [data-fill]': {
    fill: 'currentColor'
  },
  '[data-size="inline"] &': {
    w: '70%',
    h: '70%'
  },
  '[data-size="hero"] &': {
    w: '72%',
    h: '72%'
  },
  '[data-size="watermark"] &': {
    w: '100%',
    h: '100%'
  }
});

const glyphs: Record<string, ReactNode> = {
  'photo-gallery': (
    <>
      <circle cx="24" cy="24" r="16" data-stroke strokeWidth="2.8" />
      <circle cx="24" cy="24" r="7" data-stroke strokeWidth="3.2" />
      <path
        d="M24 8v8M35.3 12.7l-5.7 5.7M40 24h-8M35.3 35.3l-5.7-5.7M24 40v-8M12.7 35.3l5.7-5.7M8 24h8M12.7 12.7l5.7 5.7"
        data-stroke
        strokeWidth="2"
        opacity="0.7"
      />
      <path d="M12 40h24" data-stroke strokeWidth="2.4" opacity="0.7" />
    </>
  ),
  'rubik-algorithms': (
    <>
      <path d="M12 12h24v24H12z" data-stroke strokeWidth="2.5" />
      <path d="M20 12v24M28 12v24M12 20h24M12 28h24" data-stroke strokeWidth="1.8" opacity="0.78" />
      <path d="M36 12l5 5v24l-5-5M17 41h24l-5-5" data-stroke strokeWidth="2.2" opacity="0.7" />
      <path d="M36 20l5 5M36 28l5 5" data-stroke strokeWidth="1.6" opacity="0.52" />
    </>
  ),
  'typing-stats': (
    <>
      <circle cx="16" cy="14" r="5" data-stroke strokeWidth="2.4" />
      <path d="M7 27c2.3-5 15.7-5 18 0" data-stroke strokeWidth="2.4" />
      <path d="M31 35V21M38 35V15M45 35V25" data-stroke strokeWidth="4" />
      <path d="M30 39h16" data-stroke strokeWidth="2.2" opacity="0.7" />
    </>
  ),
  'piano-chords': (
    <>
      <path d="M8 14h32v22H8z" data-stroke strokeWidth="2.5" />
      <path d="M14 14v22M21 14v22M28 14v22M35 14v22" data-stroke strokeWidth="1.7" opacity="0.7" />
      <path d="M17 14v12M24 14v12M38 14v12" data-stroke strokeWidth="4" />
      <path d="M42 18c5 3 5 13 0 16" data-stroke strokeWidth="2.2" opacity="0.74" />
    </>
  ),
  'darts-board': (
    <>
      <circle cx="24" cy="24" r="18" data-stroke strokeWidth="2.6" />
      <circle cx="24" cy="24" r="11" data-stroke strokeWidth="2" opacity="0.72" />
      <circle cx="24" cy="24" r="4" data-fill />
      <path
        d="M24 6v36M6 24h36M11.3 11.3l25.4 25.4M36.7 11.3L11.3 36.7"
        data-stroke
        strokeWidth="1.7"
        opacity="0.45"
      />
    </>
  ),
  'link-library': (
    <>
      <circle cx="13" cy="16" r="5" data-stroke strokeWidth="2.6" />
      <circle cx="35" cy="13" r="5" data-stroke strokeWidth="2.6" />
      <circle cx="39" cy="35" r="5" data-stroke strokeWidth="2.6" />
      <circle cx="16" cy="36" r="5" data-stroke strokeWidth="2.6" />
      <path
        d="M18 15l12-2M35.8 18l2.4 12M34.5 35.3l-13.1.5M18.8 32.4l13.4-15.8"
        data-stroke
        strokeWidth="2.1"
        opacity="0.72"
      />
    </>
  ),
  'twitter-feed': (
    <>
      <circle cx="15" cy="33" r="4" data-fill />
      <path d="M15 23c7 0 13 6 13 13M15 13c13 0 23 10 23 23" data-stroke strokeWidth="3" />
      <path d="M30 12h11v9" data-stroke strokeWidth="2.4" opacity="0.72" />
    </>
  ),
  'field-notes': (
    <>
      <path d="M13 7h16l8 8v26H13z" data-stroke strokeWidth="2.6" />
      <path d="M29 7v9h8M19 22h12M19 29h14M19 36h8" data-stroke strokeWidth="2.2" opacity="0.78" />
    </>
  )
};

export const HobbyTypeGlyph = ({
  type = 'field-notes',
  label,
  size = 'badge',
  className
}: HobbyTypeGlyphProps) => (
  <span className={cx(shell, className)} data-size={size} aria-label={label} aria-hidden={!label}>
    <svg className={svg} viewBox="0 0 48 48" role="img" aria-hidden="true">
      {glyphs[type] ?? glyphs['field-notes']}
    </svg>
  </span>
);
