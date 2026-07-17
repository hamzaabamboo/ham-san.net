import { expect, test } from 'bun:test';
import { useTranslations } from '../src/i18n/utils';

test('RSS chrome and untitled fallback are localized', () => {
  const ja = useTranslations('ja');
  const th = useTranslations('th');

  expect(ja('note.rss-title')).toBe('Ham — ノート');
  expect(ja('note.untitled')).toBe('無題');
  expect(th('note.rss-description')).toBe('ฐานความรู้ส่วนตัวที่เปิดเผยต่อสาธารณะ');
});
