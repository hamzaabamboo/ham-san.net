export type MediaOptions = {
  format?: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
};

export const getMediaUrl = (path?: string, options: MediaOptions = {}, server?: string) => {
  if (!path) return undefined;
  const { format = 'webp', width, height, fit = 'inside' } = options;
  if (path?.startsWith('http://')) return path;
  let query = `?format=${format}&q=75`;
  if (width && height) {
    query += `&resize=${width}x${height}&fit=${fit}`;
  } else {
    if (width) query += `&w=${width}`;
    if (height) query += `&h=${height}`;
  }

  if (path?.includes('.gif')) query += '&animated=True';
  return server + path + query;
};

type StrapiFormat = { url?: string; width?: number; height?: number; size?: number };

export type MediaSource = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  formats?: unknown;
};

export type ResolvedMedia = { src: string; width?: number; height?: number };

const parseFormats = (formats: unknown): StrapiFormat[] => {
  if (!formats) return [];
  const source = typeof formats === 'string' ? safeParse(formats) : formats;
  if (!source || typeof source !== 'object') return [];
  return Object.values(source as Record<string, unknown>).filter(
    (entry): entry is StrapiFormat =>
      !!entry && typeof entry === 'object' && typeof (entry as StrapiFormat).url === 'string'
  );
};

const safeParse = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// The CMS origin ignores `?format=`/`?w=`/`?resize=` entirely: `?w=1` returns the same
// bytes as the bare URL. Strapi does, however, write real derivative files and records
// them in `formats`. Pick the smallest one that still covers the rendered box.
export const resolveMedia = (
  file: MediaSource | null | undefined,
  targetWidth: number,
  server?: string,
  devicePixelRatio = 1.5
): ResolvedMedia | undefined => {
  if (!file?.url) return undefined;
  // Strapi's derivatives of an animated GIF are still frames, so never swap one in.
  if (file.url.toLowerCase().endsWith('.gif')) {
    return {
      src: file.url.startsWith('http') ? file.url : (server ?? '') + file.url,
      width: file.width ?? undefined,
      height: file.height ?? undefined
    };
  }

  // Resolve each URL against the server independently: Strapi records `formats[*].url`
  // relative even when the original is absolute, so deciding the prefix once from the
  // original strips the host off every derivative.
  const absolute = (url: string) => (url.startsWith('http') ? url : (server ?? '') + url);
  const needed = targetWidth * devicePixelRatio;

  const formats = parseFormats(file.formats).filter((entry) => typeof entry.width === 'number');
  // Two tiers. Ideally a derivative covers the box at the target density; when none does,
  // one that merely covers the CSS box still beats falling back to a multi-megapixel
  // original — a 750px file in a 557px box is sharper in bytes-per-pixel terms than a
  // 2560px one, and the alternative here was a 66% payload increase.
  const wideEnough = formats.filter((entry) => entry.width! >= needed);
  const coversBox = formats.filter((entry) => entry.width! >= targetWidth);

  // Rank on width alone. `size` is in KB and `width` in px, so a comparator over both
  // scales picks the heavier file whenever one format is missing its size. The smallest
  // width that still covers the box is the fewest bytes in every real Strapi ladder.
  const byWidth = [...wideEnough].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  const byWidthFallback = [...coversBox].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));

  // Strapi re-encodes derivatives, and for some uploads every derivative is heavier than
  // the file it came from. `size` is only used to reject such a candidate, never to rank.
  // `size` is nullable on the original. Without a baseline there is nothing to compare
  // against, so no derivative may be swapped in — shipping a heavier file is the defect
  // this rule exists for. A derivative missing its own size is still eligible: it is
  // strictly narrower than the original it was cut from.
  const lighter = (entry: StrapiFormat) =>
    typeof file.size === 'number' && (typeof entry.size !== 'number' || entry.size < file.size);
  const chosen = byWidth.find(lighter) ?? byWidthFallback.find(lighter);

  if (chosen?.url) {
    return { src: absolute(chosen.url), width: chosen.width, height: chosen.height };
  }

  // No derivative is small enough to help (or none exist): the original is the only
  // correct answer.
  return {
    src: absolute(file.url),
    width: file.width ?? undefined,
    height: file.height ?? undefined
  };
};
