import { describe, expect, test } from 'bun:test';
import {
  getHobbyContentLabel,
  getHobbyCountLabel,
  getHobbyEmbedDescription,
  getHobbyEmbedLabel,
  getHobbyOverviewDescription,
  getHobbyOverviewSummary,
  type HobbyTranslationKey
} from '../src/utils/hobby-labels';

const t = (key: HobbyTranslationKey) => key;
const metricT = (key: HobbyTranslationKey) =>
  ({
    'hobbies.metric-link': '{count} link',
    'hobbies.metric-links': '{count} links',
    'hobbies.metric-page': '{count} page',
    'hobbies.metric-pages': '{count} pages'
  })[key] ?? key;
const metricJaT = (key: HobbyTranslationKey) =>
  ({
    'hobbies.metric-link': 'リンク{count}件',
    'hobbies.metric-links': 'リンク{count}件',
    'hobbies.metric-page': '{count}ページ',
    'hobbies.metric-pages': '{count}ページ'
  })[key] ?? key;

describe('hobby labels', () => {
  test('maps embed labels and descriptions through translation keys', () => {
    expect(getHobbyEmbedLabel(t, 'photo-gallery')).toBe('hobbies.embed-photo-gallery');
    expect(getHobbyEmbedDescription(t, 'piano-chords')).toBe(
      'hobbies.embed-piano-chords-description'
    );
  });

  test('falls back to field notes labels for unknown embed types', () => {
    expect(getHobbyEmbedLabel(t, 'unknown')).toBe('hobbies.embed-field-notes');
    expect(getHobbyEmbedDescription(t, undefined)).toBe('hobbies.embed-field-notes-description');
  });

  test('maps overview descriptions through translation keys', () => {
    expect(getHobbyOverviewDescription(t, 'photo-gallery')).toBe('hobbies.overview-photo-gallery');
    expect(getHobbyOverviewDescription(t, 'unknown')).toBe('hobbies.overview-field-notes');
  });

  test('uses a draft page label when the source note has no usable content', () => {
    expect(getHobbyContentLabel({ hasSource: false, type: 'field-notes', t })).toBe(
      'hobbies.embed-empty-page'
    );
    expect(getHobbyContentLabel({ hasSource: true, type: 'field-notes', t })).toBe(
      'hobbies.embed-field-notes'
    );
  });

  test('drops generic overview summaries instead of substituting canned copy', () => {
    expect(
      getHobbyOverviewSummary({
        hasSource: true,
        value: 'Stats and gear.',
        t
      })
    ).toBe('');
    expect(
      getHobbyOverviewSummary({
        hasSource: true,
        value: 'Pictures, gear, and lens references (added 2026-03-06).',
        t
      })
    ).toBe('');
    expect(
      getHobbyOverviewSummary({
        hasSource: true,
        value: undefined,
        t
      })
    ).toBe('');
  });

  test('preserves meaningful overview summaries in every locale', () => {
    expect(
      getHobbyOverviewSummary({
        hasSource: true,
        value: 'Trombone / Piano / Transcriptions',
        t
      })
    ).toBe('Trombone / Piano / Transcriptions');
    expect(
      getHobbyOverviewSummary({
        hasSource: true,
        value: 'Daily routine cheatsheet for posture rehab.',
        t
      })
    ).toBe('Daily routine cheatsheet for posture rehab.');
  });

  test('uses parked overview copy for empty source pages', () => {
    expect(
      getHobbyOverviewSummary({
        hasSource: false,
        value: 'Parked for now.',
        t
      })
    ).toBe('hobbies.overview-empty-page');
  });

  test('formats hobby metric counts with singular and plural templates', () => {
    expect(getHobbyCountLabel({ count: 1, locale: 'en', type: 'page', t: metricT })).toBe('1 page');
    expect(getHobbyCountLabel({ count: 2, locale: 'en', type: 'page', t: metricT })).toBe(
      '2 pages'
    );
    expect(getHobbyCountLabel({ count: 1, locale: 'en', type: 'link', t: metricT })).toBe('1 link');
  });

  test('formats Japanese metric counts with native counter placement', () => {
    expect(getHobbyCountLabel({ count: 12, locale: 'ja', type: 'link', t: metricJaT })).toBe(
      'リンク12件'
    );
    expect(getHobbyCountLabel({ count: 2, locale: 'ja', type: 'page', t: metricJaT })).toBe(
      '2ページ'
    );
  });
});
