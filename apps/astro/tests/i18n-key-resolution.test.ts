import { describe, expect, test } from 'bun:test';
import { NAMECARD_PAGE_LINKS } from 'utils/namecard-page';
import { useTranslations } from '../src/i18n/utils';
import { languages } from '../src/i18n/ui';

// The parity script compares the three locales against EACH OTHER, so a key missing from all
// three passes it. That is exactly how `name-card.tierlist`, `name-card.tierlist-description`
// and `name-card.home` shipped as visible copy: `t()` returns the key it cannot resolve.
describe('every key referenced in code resolves in every locale', () => {
  const locales = Object.keys(languages) as (keyof typeof languages)[];

  test('namecard link labels and values are real copy, not key names', () => {
    const unresolved: string[] = [];
    for (const locale of locales) {
      const t = useTranslations(locale);
      for (const link of NAMECARD_PAGE_LINKS) {
        for (const key of [link.labelKey, link.valueKey]) {
          if (!key) continue;
          const rendered = t(key as 'name-card.name');
          // `t()` echoes the key back when it cannot resolve it — and the key's last segment
          // is what reaches the page.
          if (rendered === key || rendered === key.split('.').pop()) {
            unresolved.push(`${locale}: ${key}`);
          }
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  test('the namecard link set actually declares keys to check', () => {
    // A floor, so the test above cannot pass by iterating an empty list.
    const keyed = NAMECARD_PAGE_LINKS.filter((link) => link.labelKey || link.valueKey);
    expect(keyed.length).toBeGreaterThanOrEqual(3);
  });
});
