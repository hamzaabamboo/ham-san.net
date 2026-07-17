const WORD_PATTERN = /[\p{L}\p{N}]+/gu;

export const projectMonogram = (title?: string | null) => {
  const words = String(title ?? '').match(WORD_PATTERN) ?? [];
  if (words.length === 0) return 'P';
  const initials = words.slice(0, 2).map((word) => [...word][0].toUpperCase());
  return initials.join('');
};
