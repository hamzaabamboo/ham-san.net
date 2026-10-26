import { describe, expect, it } from 'bun:test';
import { pickLocale } from '../src/utils/fallbackLocale';

describe('pickLocale', () => {
  const item = {
    locale: 'en',
    title: 'EN',
    localizations: [{ locale: 'ja', title: 'JA' }, null, { locale: 'th', title: 'TH' }]
  };

  it('returns the item when the locale already matches', () => {
    expect(pickLocale(item, 'en')?.title).toBe('EN');
  });

  it('returns the matching localization', () => {
    expect(pickLocale(item, 'ja')?.title).toBe('JA');
  });

  it('falls back to the base item for missing locales', () => {
    expect(pickLocale(item, 'fr')?.title).toBe('EN');
  });

  it('returns null for missing items', () => {
    expect(pickLocale(null, 'en')).toBeNull();
  });
});
