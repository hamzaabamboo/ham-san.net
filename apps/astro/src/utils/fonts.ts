// Newsreader is requested without the `opsz` axis: carrying it cost 516,188 B against
// 222,564 B for the same six faces, and every heading on the site computes to weight 400
// or 700 at a size the default optical master already suits.
const LATIN_FONTS =
  'family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400..800&family=Newsreader:ital,wght@0,400..800;1,400..800';

const LOCALE_FONTS: Record<string, string> = {
  // Noto Serif JP is not requested: it transferred 480,896 B across 18 subset requests to
  // set seven headings. The family stays in the `--font-display` stack, so a visitor who
  // has it locally still gets it, and everyone else falls to Hiragino Mincho ProN (macOS)
  // or Yu Mincho (Windows) — both real CJK serifs — at no network cost. Noto Serif Thai is
  // kept: it is 175,872 B across 6 files and Thai system serif coverage is weaker.
  // Two weights, not three. Each weight of Noto Sans JP is ~30 KB gz across ~124 subsets, and
  // 500 had a single consumer (`.shell-nav-link`) which is now 400. Measured: 91,937 -> 61,265
  // B gz. A `400..700` variable range is NOT smaller here — it measures 122,356 B, because the
  // subset count, not the weight axis, is what dominates.
  ja: '&family=Noto+Sans+JP:wght@400;700',
  th: '&family=Noto+Sans+Thai:wght@400;500;700&family=Noto+Serif+Thai:wght@400;700'
};

export const fontHref = (lang: string, extra = '') =>
  `https://fonts.googleapis.com/css2?${LATIN_FONTS}${LOCALE_FONTS[lang] ?? ''}${extra}&display=swap`;

// Verified in a browser: NamecardLayout's unlayered `<style is:global>` sets
// `html.namecard-document body { font-family: 'M PLUS 1p', … }`, and an unlayered rule
// beats index.css's `@layer base` rules regardless of specificity. The computed
// font-family on /ja/namecard/default contains no Manrope and no Noto, so requesting
// them would be dead weight.
export const namecardFontHref = () =>
  'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap';
