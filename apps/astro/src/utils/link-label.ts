const WORD_JOINER = '⁠';

const GENERIC_SEGMENTS = new Set([
  'list',
  'products',
  'index',
  'profile',
  'user',
  'users',
  'u',
  'score',
  'scores',
  'document',
  'app',
  'en',
  'ja',
  'th',
  'status',
  'n',
  's',
  'd',
  'file',
  'edit',
  'view'
]);

const DOCUMENT_EXTENSION = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i;

const isOpaqueId = (segment: string) => {
  if (!/\d/.test(segment) || !/[A-Za-z]/.test(segment)) return false;
  if (/^[A-Za-z0-9]{10,}$/.test(segment)) return true;
  return (
    /^[A-Za-z0-9_-]{16,}$/.test(segment) &&
    !segment.split(/[-_]/).some((part) => /^[A-Za-z]{3,}$/.test(part))
  );
};

const pickLabelSegment = (segments: string[]) => {
  const last = segments[segments.length - 1];
  if (last && DOCUMENT_EXTENSION.test(last)) return last;
  return segments
    .filter(
      (segment) =>
        !/^\d+$/.test(segment) &&
        !GENERIC_SEGMENTS.has(segment.toLowerCase()) &&
        !isOpaqueId(segment)
    )
    .reduce((best, segment) => (segment.length >= best.length ? segment : best), '');
};

const decodeSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const humanizeSegment = (value: string, keepUnderscores: boolean) =>
  (keepUnderscores
    ? value
    : value
        .replace(/\.(html?|php|aspx|jsp)$/i, '')
        .replace(/^[\d.]+[-_](?=\p{L})/u, '')
        .replace(/_+/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

export const truncateLinkLabel = (value: string, max: number) => {
  if (value.length <= max) return value;
  const clipped = value.slice(0, max);
  const lastSpace = clipped.lastIndexOf(' ');
  const head = (lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd();
  return `${head}${WORD_JOINER}…`;
};

export type KnownLinkLabels = {
  googlePhotosAlbum: string;
  youtubeVideo: string;
  youtubePlaylist: string;
  numbered: (label: string, n: number) => string;
};

export const defaultKnownLinkLabels: KnownLinkLabels = {
  googlePhotosAlbum: 'Google Photos album',
  youtubeVideo: 'YouTube video',
  youtubePlaylist: 'YouTube playlist',
  numbered: (label, n) => `${label} ${n}`
};

type KnownLinkLabelKey =
  | 'common.link-google-photos-album'
  | 'common.link-youtube-video'
  | 'common.link-youtube-playlist'
  | 'common.link-numbered';

export const knownLinkLabelsFrom = (t: (key: KnownLinkLabelKey) => string): KnownLinkLabels => ({
  googlePhotosAlbum: t('common.link-google-photos-album'),
  youtubeVideo: t('common.link-youtube-video'),
  youtubePlaylist: t('common.link-youtube-playlist'),
  numbered: (label, n) =>
    t('common.link-numbered').replace('{label}', label).replace('{n}', String(n))
});

export const isKnownLinkLabel = (label: string, labels: KnownLinkLabels) =>
  label === labels.googlePhotosAlbum ||
  label === labels.youtubeVideo ||
  label === labels.youtubePlaylist;

const getKnownHostLabel = (url: URL, host: string, labels: KnownLinkLabels) => {
  if (host === 'photos.app.goo.gl' || host === 'photos.google.com') return labels.googlePhotosAlbum;
  if (host === 'youtu.be') return labels.youtubeVideo;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.searchParams.has('list') && ['/watch', '/playlist'].includes(url.pathname)) {
      return labels.youtubePlaylist;
    }
    if (url.pathname === '/watch' && url.searchParams.has('v')) return labels.youtubeVideo;
  }
  return undefined;
};

export const formatBareUrlLabel = (
  rawUrl: string,
  maxDetailLength?: number,
  labels: KnownLinkLabels = defaultKnownLinkLabels
) => {
  const href = rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl;
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, '');
    const knownLabel = getKnownHostLabel(url, host, labels);
    if (knownLabel) return knownLabel;
    const segments = url.pathname.split('/').filter(Boolean).map(decodeSegment);
    const isRepoHost = host === 'github.com' || host === 'gitlab.com';
    const isPostHost = ['x.com', 'twitter.com', 'mobile.twitter.com'].includes(host);
    let detail: string;
    if (isRepoHost && segments.length >= 2) {
      detail = `${segments[0]}/${segments[1]}`;
    } else if (
      isPostHost &&
      segments.length >= 3 &&
      segments[0] !== 'i' &&
      segments[1] === 'status'
    ) {
      detail = `@${segments[0]}`;
    } else {
      const segment = pickLabelSegment(segments);
      const keepUnderscores =
        segment.startsWith('@') ||
        (segments.length > 1 && segment === segments[0] && /^\w+$/.test(segment));
      detail = humanizeSegment(segment, keepUnderscores);
    }
    if (!detail) return host;
    const visibleDetail = maxDetailLength ? truncateLinkLabel(detail, maxDetailLength) : detail;
    return `${host}${WORD_JOINER} / ${visibleDetail}`;
  } catch {
    return rawUrl;
  }
};
