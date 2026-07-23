export const makeExcerpt = (summary: unknown, max: number) => {
  const cleaned = String(summary ?? '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\(image\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return null;
  return cleaned.length > max ? `${cleaned.slice(0, max).trimEnd()}...` : cleaned;
};
