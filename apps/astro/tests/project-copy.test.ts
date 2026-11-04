import { describe, expect, it } from 'bun:test';
import {
  mergeLocaleRecords,
  pickCurrentLocaleRecord,
  pickLocale
} from '../src/utils/fallbackLocale';

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

describe('mergeLocaleRecords', () => {
  it('prefers localized records, includes missing fallback and preserves localized-only records', () => {
    const localized = [
      { documentId: 'shared', start: '2024-01-01', title: 'JA' },
      { documentId: 'ja-only', start: '2022-01-01', title: 'JA only' }
    ];
    const fallback = [
      { documentId: 'new', start: '2026-01-01', title: 'EN only' },
      { documentId: 'shared', start: '2024-01-01', title: 'EN' },
      null
    ];
    expect(mergeLocaleRecords(localized, fallback).map((record) => record.title)).toEqual([
      'EN only',
      'JA',
      'JA only'
    ]);
    expect(localized).toHaveLength(2);
  });

  it('handles absent lists and sorts undated records last', () => {
    expect(
      mergeLocaleRecords(null, [
        { documentId: 'undated', start: null },
        { documentId: 'dated', start: '2025-01-01' }
      ]).map((record) => record.documentId)
    ).toEqual(['dated', 'undated']);
    expect(mergeLocaleRecords(null, null)).toEqual([]);
  });
});

describe('pickCurrentLocaleRecord', () => {
  it('selects an active fixed-term role instead of a future or ended role', () => {
    const records = [
      { locale: 'en', start: '2027-01-01', end: null, localizations: [] },
      { locale: 'en', start: '2025-01-01', end: '2026-12-31', localizations: [] },
      { locale: 'en', start: '2024-01-01', end: '2025-12-31', localizations: [] }
    ];
    expect(pickCurrentLocaleRecord(records, 'ja', '2026-11-04')).toBe(records[1]);
    expect(pickCurrentLocaleRecord(records, 'ja', '2028-01-01')).toBe(records[0]);
    expect(pickCurrentLocaleRecord(records, 'ja', '2023-01-01')).toBeNull();
  });
});
