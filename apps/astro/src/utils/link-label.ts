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
    .replace(/_+/g, ' ')
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

const isOpaqueId = (segment: string) =>
  /^[A-Za-z0-9]{10,}$/.test(segment) && /\d/.test(segment) && /[A-Za-z]/.test(segment);

export type KnownLinkLabels = {
  googlePhotosAlbum: string;
  youtubeVideo: string;
  youtubePlaylist: string;
};

const defaultKnownLinkLabels: KnownLinkLabels = {
  googlePhotosAlbum: 'Google Photos album',
  youtubeVideo: 'YouTube video',
  youtubePlaylist: 'YouTube playlist'
};

type KnownLinkLabelKey =
  | 'common.link-google-photos-album'
  | 'common.link-youtube-video'
  | 'common.link-youtube-playlist';

export const knownLinkLabelsFrom = (t: (key: KnownLinkLabelKey) => string): KnownLinkLabels => ({
  googlePhotosAlbum: t('common.link-google-photos-album'),
  youtubeVideo: t('common.link-youtube-video'),
  youtubePlaylist: t('common.link-youtube-playlist')
});

const getKnownHostLabel = (url: URL, host: string, labels: KnownLinkLabels) => {
  if (host === 'photos.app.goo.gl' || host === 'photos.google.com') return labels.googlePhotosAlbum;
  if (host === 'youtu.be') return labels.youtubeVideo;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch' && url.searchParams.has('v')) return labels.youtubeVideo;
    if (url.pathname === '/playlist' && url.searchParams.has('list')) return labels.youtubePlaylist;
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
    const segment = pickLabelSegment(url.pathname);
    if (isOpaqueId(segment)) return host;
    const detail = humanizeSegment(segment);
    if (!detail) return host;
    const visibleDetail = maxDetailLength ? truncateLinkLabel(detail, maxDetailLength) : detail;
    return `${host}${WORD_JOINER} / ${visibleDetail}`;
  } catch {
    return rawUrl;
  }
};
