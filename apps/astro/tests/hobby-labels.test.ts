import { describe, expect, test } from 'bun:test';
import {
  getHobbyContentLabel,
  getHobbyCountLabel,
  getHobbyEmbedDescription,
  getHobbyEmbedLabel,
  getLocalizedHobbySummary,
  type HobbyEmbedTranslationKey,
  type HobbyTranslationKey,
  shouldLocalizeHobbySummary
} from '../src/utils/hobby-labels';

const t = (key: HobbyEmbedTranslationKey) => key;
const metricT = (key: HobbyTranslationKey) =>
  ({
    'hobbies.metric-link': 'Link',
    'hobbies.metric-links': 'Links',
    'hobbies.metric-page': 'Page',
    'hobbies.metric-pages': 'Pages'
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

  test('uses a draft page label when the source note has no usable content', () => {
    expect(getHobbyContentLabel({ hasSource: false, type: 'field-notes', t })).toBe(
      'hobbies.embed-empty-page'
    );
    expect(getHobbyContentLabel({ hasSource: true, type: 'field-notes', t })).toBe(
      'hobbies.embed-field-notes'
    );
  });

  test('localizes plain English summaries outside English chrome', () => {
    expect(shouldLocalizeHobbySummary('th', 'Pictures, gear, and lens references.')).toBe(true);
    expect(
      getLocalizedHobbySummary({
        locale: 'th',
        value: 'Pictures, gear, and lens references.',
        type: 'photo-gallery',
        t
      })
    ).toBe('hobbies.embed-photo-gallery-description');
  });

  test('preserves localized and English summaries in their own chrome', () => {
    expect(shouldLocalizeHobbySummary('th', 'รูปภาพและลิงก์ภาพจากโน้ต')).toBe(false);
    expect(shouldLocalizeHobbySummary('ja', 'ノート内の画像と写真リンク。')).toBe(false);
    expect(shouldLocalizeHobbySummary('en', 'Pictures, gear, and lens references.')).toBe(false);
  });

  test('formats hobby metric counts with singular and plural labels', () => {
    expect(getHobbyCountLabel({ count: 1, locale: 'en', type: 'page', t: metricT })).toBe('1 Page');
    expect(getHobbyCountLabel({ count: 2, locale: 'en', type: 'page', t: metricT })).toBe(
      '2 Pages'
    );
    expect(getHobbyCountLabel({ count: 1, locale: 'en', type: 'link', t: metricT })).toBe('1 Link');
  });
});
