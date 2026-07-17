import { expect, test } from 'bun:test';
import { localizePath } from '../src/i18n/path';

test('locale switches preserve the current query string', () => {
  expect(localizePath('/en/events', 'ja', '?year=2024')).toBe('/ja/events?year=2024');
});
