export const getHostLabel = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
};

export const getPathLabel = (href: string) => {
  try {
    const url = new URL(href);
    const path = url.pathname.replace(/\/+$/, '');
    return path.length > 1 ? path : getHostLabel(href);
  } catch {
    return href;
  }
};

export const getLinkTileParts = ({ href, label }: { href: string; label: string }) => {
  const host = getHostLabel(href);
  if (label !== host && label !== href) return { label, detail: host };
  const path = getPathLabel(href);
  return { label: host, detail: path === host ? undefined : path };
};

export const cleanSourceText = (value: string) =>
  value
    .replace(/\\~/g, '~')
    .replace(/\\/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getMarkdownSection = (body: string, heading: string) => {
  const match = body.match(
    new RegExp(`(?:^|\\n)#\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n#\\s+|$)`, 'i')
  );
  return match?.[1]?.trim() ?? '';
};

export const getListItems = (source: string) =>
  Array.from(source.matchAll(/^[-*+]\s+(.+)$/gm))
    .map((match) => cleanSourceText(match[1] ?? ''))
    .filter(Boolean);
