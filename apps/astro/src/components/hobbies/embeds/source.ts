export const getHostLabel = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
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
