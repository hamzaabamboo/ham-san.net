import { expect, test } from 'bun:test';
import { useTranslations } from '../src/i18n/utils';

test('nullable CMS labels are localized in Japanese and Thai', () => {
  const ja = useTranslations('ja');
  const th = useTranslations('th');

  expect(ja('common.records-pending')).toBe('記録待ち');
  expect(th('hobbies.untitled')).toBe('ไม่มีชื่อ');
  expect(ja('home.profile-image-alt')).toBe('Tanyawat Vittayapalotai のプロフィール写真');
  expect(th('contact.placeholder-message')).toEndWith('…');
});
