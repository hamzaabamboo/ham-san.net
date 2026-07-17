const WORD_JOINER = '⁠';

const pickLabelSegment = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.reduce((best, segment) => (segment.length >= best.length ? segment : best), '');
};

const humanizeSegment = (segment: string) => {
  let value = segment;
  try {
    value = decodeURIComponent(segment);
  } catch {
    value = segment;
  }
  return value
    .replace(/\.(html?|php|aspx|jsp)$/i, '')
    .replace(/^[\d.]+[-_](?=\p{L})/u, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const truncateLinkLabel = (value: string, max: number) => {
  if (value.length <= max) return value;
  const clipped = value.slice(0, max);
  const lastSpace = clipped.lastIndexOf(' ');
  const head = (lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd();
  return `${head}${WORD_JOINER}…`;
};

export const formatBareUrlLabel = (rawUrl: string, maxDetailLength = 52) => {
  const href = rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl;
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, '');
    const detail = humanizeSegment(pickLabelSegment(url.pathname));
    if (!detail) return host;
    return `${host}${WORD_JOINER} / ${truncateLinkLabel(detail, maxDetailLength)}`;
  } catch {
    return rawUrl;
  }
};
