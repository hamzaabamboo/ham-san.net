const WORD_PATTERN = /[\p{L}\p{N}]+/gu;
// A digit is not a Latin run: `\p{N}` here made "推し活記録 2024" resolve to a lone "2" set at
// 96px in a display serif, the same broken-mark failure as "ぼB".
const LATIN = /^\p{Script=Latin}/u;

// A monogram must stay in one script. Taking the first character of each of the first two
// words produced "ぼB" for「ぼっちラブカシミュレーター (Bocchi Loveca Simulator)」— a kana and a
// Latin capital side by side in a Latin display serif, which reads as broken text.
export const projectMonogram = (title?: string | null) => {
  const words = String(title ?? '').match(WORD_PATTERN) ?? [];
  if (words.length === 0) return 'P';

  // Prefer the Latin run when the title has one: two initials read as a mark.
  const latinWords = words.filter((word) => LATIN.test(word));
  if (latinWords.length > 0) {
    return latinWords
      .slice(0, 2)
      .map((word) => [...word][0].toUpperCase())
      .join('');
  }

  // Otherwise take up to two characters from the first word, which is how a CJK title
  // abbreviates — never one character from each of two words.
  return [...(words[0] ?? '')].slice(0, 2).join('') || 'P';
};
