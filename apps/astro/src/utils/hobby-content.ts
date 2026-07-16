export type HobbyFrontmatter = Record<string, string | string[] | boolean | undefined>;

export type HobbyEmbedConfig = {
  type: string;
  label: string;
};

export type HobbyLink = {
  href: string;
  label: string;
};

export type HobbyBodyPart =
  | { type: 'markdown'; content: string }
  | { type: 'embed'; index: number };

export type HobbyContentModel = {
  body: string;
  sourceBody: string;
  meta: HobbyFrontmatter;
  description: string;
  banner?: string;
  images: string[];
  links: HobbyLink[];
  embeds: HobbyEmbedConfig[];
  status: 'active' | 'inactive';
  updatedAt?: string;
};

const embedAliases: Record<string, string> = {
  camera: 'photo-gallery',
  cube: 'rubik-algorithms',
  darts: 'darts-board',
  gallery: 'photo-gallery',
  geoguessr: 'link-library',
  links: 'link-library',
  photo: 'photo-gallery',
  photos: 'photo-gallery',
  piano: 'piano-chords',
  rubik: 'rubik-algorithms',
  rubiks: 'rubik-algorithms',
  stats: 'typing-stats',
  twitter: 'twitter-feed',
  typing: 'typing-stats',
  x: 'twitter-feed'
};

const normalize = (value?: string | null) => (value ?? '').trim().toLowerCase();

const asString = (value: HobbyFrontmatter[string]) =>
  typeof value === 'string' ? value.trim() : undefined;

const formatList = (items: string[]) => {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

const cleanDescription = (value?: string) => {
  const cleaned = value
    ?.replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\\/g, '')
    .replace(/\\\.\.\.$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || /^[.\s]+$/.test(cleaned)) return undefined;
  if (cleaned === '...') return undefined;
  if (/^(https?:\/\/|www\.)/i.test(cleaned)) return undefined;
  if (!/[a-z0-9]{3}/i.test(cleaned)) return undefined;
  if (/^[\w\s/-]+:$/.test(cleaned)) return undefined;
  return cleaned;
};

const getProseDescription = (content: string) => {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const prose = paragraphs.find(
    (paragraph) => !/^(#|[-*+]\s|!\[|<?https?:\/\/|www\.|::|<!--)/.test(paragraph)
  );

  return cleanDescription(prose);
};

export const getHobbyBodyIntro = (body: string) => getProseDescription(body) ?? '';

const getHeadingDescription = (content: string) => {
  const headings = Array.from(content.matchAll(/^#{1,3}\s+(.+)$/gm))
    .map((match) => cleanDescription(match[1]))
    .filter((heading): heading is string => !!heading)
    .map((heading, index) => (index === 0 ? heading : heading.toLowerCase()))
    .slice(0, 3);

  if (headings.length === 0) return undefined;
  return `${formatList(headings)}.`;
};

const parseValue = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  return trimmed.replace(/^["']|["']$/g, '');
};

export const parseHobbyFrontmatter = (content?: string) => {
  const lines = (content ?? '').split('\n');
  if (lines[0]?.trim() !== '---') {
    return { meta: {} as HobbyFrontmatter, body: content ?? '' };
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closingIndex < 0) {
    return { meta: {} as HobbyFrontmatter, body: content ?? '' };
  }

  const meta = Object.fromEntries(
    lines
      .slice(1, closingIndex)
      .map((line) => {
        const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
        if (!match) return null;
        return [match[1], parseValue(match[2])] as const;
      })
      .filter((entry): entry is readonly [string, string | string[] | boolean] => !!entry)
  );

  return {
    meta,
    body: lines
      .slice(closingIndex + 1)
      .join('\n')
      .trim()
  };
};

export const normalizeHobbyEmbedKey = (token?: string) => {
  if (!token) return undefined;
  const normalized = normalize(token).replace(/_/g, '-');
  return embedAliases[normalized] ?? normalized;
};

const parseDirective = (line: string): HobbyEmbedConfig | undefined => {
  const bracketMatch = line.match(
    /^::hobby(?:-embed)?\s*\[\s*([a-zA-Z0-9_-]+)\s*(?:\|\s*([^\]]+?)\s*)?\]\s*$/
  );
  const objectMatch = line.match(/^::hobby(?:-embed)?\s*\{\s*(.+?)\s*\}\s*$/);
  const commentMatch = line.match(/^<!--\s*hobby:([a-zA-Z0-9_-]+)\s*-->\s*$/);
  const shorthandMatch = line.match(
    /^::(?!hobby(?:-embed)?\b)([a-zA-Z0-9_-]+)(?:\s*\[\s*([^\]]+?)\s*\])?\s*$/
  );
  const getField = (source: string, key: string) => {
    const match = source.match(
      new RegExp(`(?:^|[\\s,])${key}\\s*[:=]\\s*(?:"([^"]+)"|'([^']+)'|([^\\s,}]+))`)
    );
    return match?.[1] ?? match?.[2] ?? match?.[3];
  };
  const rawType =
    bracketMatch?.[1] ??
    commentMatch?.[1] ??
    getField(objectMatch?.[1] ?? '', 'type') ??
    shorthandMatch?.[1];
  const rawLabel =
    bracketMatch?.[2] ??
    shorthandMatch?.[2] ??
    getField(objectMatch?.[1] ?? '', 'label') ??
    getField(objectMatch?.[1] ?? '', 'title');
  const type = normalizeHobbyEmbedKey(rawType);
  if (!type) return;
  return { type, label: rawLabel?.trim() || type };
};

export const extractHobbyDirectives = (content: string) => {
  const embeds: HobbyEmbedConfig[] = [];
  const body = content
    .split('\n')
    .map((line) => {
      const directive = parseDirective(line.trim());
      if (!directive) return line;
      const index = embeds.length;
      embeds.push(directive);
      return `<!-- hobby-embed:${index} -->`;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { embeds, body };
};

const cleanSourceArtifacts = (content: string) =>
  content
    .replace(/[ \t]+\\+[ \t]*(\n(?=#{1,6}\s+))/g, '$1')
    .split('\n')
    .filter((line) => !/^(?:[-*+]\s+)?\\+$/.test(line.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const splitHobbyBodyParts = (body: string, embedCount: number): HobbyBodyPart[] => {
  const marker = /<!--\s*hobby-embed:(\d+)\s*-->/g;
  const parts: HobbyBodyPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = marker.exec(body))) {
    const markdown = body.slice(lastIndex, match.index).trim();
    if (markdown) parts.push({ type: 'markdown', content: markdown });
    parts.push({ type: 'embed', index: Number(match[1]) });
    lastIndex = marker.lastIndex;
  }

  const remaining = body.slice(lastIndex).trim();
  if (remaining) parts.push({ type: 'markdown', content: remaining });

  if (parts.some((part) => part.type === 'embed') || embedCount === 0) return parts;
  return [{ type: 'embed', index: 0 }, ...parts];
};

export const extractMarkdownImages = (content: string) =>
  Array.from(content.matchAll(/!\[[^\]]*]\(([^)]+)\)/g))
    .map((match) => match[1]?.trim())
    .filter((src): src is string => !!src);

const formatLinkLabel = (href: string, fallback?: string) => {
  const label = fallback?.replace(/\\/g, '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
  if (label && !/^https?:\/\//i.test(label)) return label;

  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
};

export const extractMarkdownLinks = (content: string) => {
  const links = new Map<string, HobbyLink>();

  for (const match of content.matchAll(/(?<!!)\[([^\]]+)]\(([^)]+)\)/g)) {
    const href = match[2]?.trim();
    if (!href || href.startsWith('#')) continue;
    links.set(href, { href, label: formatLinkLabel(href, match[1]) });
  }

  for (const match of content.matchAll(/<((?:https?:\/\/|www\.)[^>\s]+)>/g)) {
    const rawHref = match[1]?.trim().replace(/[.,;:!?]+$/, '');
    if (!rawHref) continue;
    const href = rawHref.startsWith('www.') ? `https://${rawHref}` : rawHref;
    if (!links.has(href)) links.set(href, { href, label: formatLinkLabel(href) });
  }

  for (const match of content.matchAll(/(?:^|\s)((?:https?:\/\/|www\.)[^\s)]+)/g)) {
    const rawHref = match[1]?.trim().replace(/[.,;:!?]+$/, '');
    if (!rawHref) continue;
    const href = rawHref.startsWith('www.') ? `https://${rawHref}` : rawHref;
    if (!links.has(href)) links.set(href, { href, label: formatLinkLabel(href) });
  }

  for (const match of content.matchAll(/(?:^|\s)((?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)]*)?)/gi)) {
    const rawHref = match[1]?.trim().replace(/[.,;:!?]+$/, '');
    if (!rawHref || rawHref.includes('@') || rawHref.startsWith('www.')) continue;
    const href = `https://${rawHref}`;
    if (!links.has(href)) links.set(href, { href, label: formatLinkLabel(href) });
  }

  return Array.from(links.values());
};

export const getHobbyStatus = (meta: HobbyFrontmatter): 'active' | 'inactive' => {
  const status = normalize(asString(meta.status));
  if (status === 'inactive' || meta.active === false) return 'inactive';
  return 'active';
};

export const parseHobbyContent = ({
  text,
  fallbackUpdatedAt
}: {
  title?: string | null;
  text?: string | null;
  fallbackUpdatedAt?: string | null;
}): HobbyContentModel => {
  const { meta, body: withoutMeta } = parseHobbyFrontmatter(text ?? '');
  const { embeds: directedEmbeds, body: sourceBody } = extractHobbyDirectives(withoutMeta);
  const metaType = normalizeHobbyEmbedKey(asString(meta.component) ?? asString(meta.embed));
  const metaLabel =
    asString(meta.embedLabel) ??
    asString(meta.componentLabel) ??
    asString(meta.moduleTitle) ??
    metaType;
  const embeds =
    directedEmbeds.length > 0
      ? directedEmbeds
      : metaType
        ? [{ type: metaType, label: metaLabel ?? metaType }]
        : [];
  const body = cleanSourceArtifacts(sourceBody);
  const images = extractMarkdownImages(sourceBody);
  const links = extractMarkdownLinks(sourceBody);
  const description =
    cleanDescription(asString(meta.description)) ??
    cleanDescription(asString(meta.summary)) ??
    cleanDescription(asString(meta.categoryDescription)) ??
    getProseDescription(sourceBody) ??
    getHeadingDescription(sourceBody) ??
    '';
  const banner = asString(meta.banner) ?? asString(meta.image) ?? undefined;

  return {
    body,
    sourceBody,
    meta,
    description,
    banner,
    images,
    links,
    embeds,
    status: getHobbyStatus(meta),
    updatedAt: asString(meta.updated) ?? asString(meta.updatedAt) ?? fallbackUpdatedAt ?? undefined
  };
};
