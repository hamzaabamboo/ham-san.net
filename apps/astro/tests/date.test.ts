import { describe, expect, test } from 'bun:test';
import { formatDistanceBetween, formatMonthSpan, formatMonthYear, parseDate } from 'utils/date';

describe('parseDate', () => {
  test('parses YYYY-MM-DD into a local date', () => {
    const date = parseDate('2024-06-15');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(15);
  });

  test('returns an invalid date for malformed input', () => {
    expect(Number.isNaN(parseDate('not-a-date').getTime())).toBe(true);
  });
});

describe('formatDistanceBetween', () => {
  test('keeps sub-month precision for shared relative-time consumers', () => {
    expect(formatDistanceBetween(new Date(2026, 6, 17, 10), new Date(2026, 6, 17, 12))).toBe(
      '2 hours'
    );
  });
});

describe('formatMonthSpan', () => {
  test('counts a same-month span as one month', () => {
    expect(formatMonthSpan(new Date(2018, 5, 1), new Date(2018, 5, 30))).toBe('1 month');
  });

  test('counts inclusive months across a partial year', () => {
    expect(formatMonthSpan(new Date(2018, 5, 1), new Date(2018, 6, 15))).toBe('2 months');
  });

  test('rolls an inclusive twelve-month span into one year', () => {
    expect(formatMonthSpan(new Date(2019, 5, 1), new Date(2020, 4, 15))).toBe('1 year');
  });

  test('floors multi-year spans to whole years', () => {
    expect(formatMonthSpan(new Date(2023, 7, 1), new Date(2026, 6, 16))).toBe('3 years');
    expect(formatMonthSpan(new Date(2023, 7, 1), new Date(2026, 5, 16))).toBe('2 years');
  });

  test('accepts reversed arguments', () => {
    expect(formatMonthSpan(new Date(2020, 4, 15), new Date(2019, 5, 1))).toBe('1 year');
  });

  test('formats Japanese units without spaces', () => {
    expect(formatMonthSpan(new Date(2018, 5, 1), new Date(2018, 6, 15), 'ja')).toBe('2か月');
    expect(formatMonthSpan(new Date(2019, 5, 1), new Date(2020, 4, 15), 'ja')).toBe('1年');
  });

  test('formats Thai units with spaces', () => {
    expect(formatMonthSpan(new Date(2018, 5, 1), new Date(2018, 6, 15), 'th')).toBe('2 เดือน');
    expect(formatMonthSpan(new Date(2019, 5, 1), new Date(2020, 4, 15), 'th')).toBe('1 ปี');
  });
});

describe('formatMonthYear', () => {
  test('formats per locale', () => {
    const date = new Date(2024, 0, 1);
    expect(formatMonthYear(date, 'en')).toBe('January 2024');
    expect(formatMonthYear(date, 'ja')).toBe('2024年1月');
    expect(formatMonthYear(date, 'th')).toContain('2024');
  });

  test('returns empty string for invalid dates', () => {
    expect(formatMonthYear(new Date(Number.NaN), 'en')).toBe('');
  });
});
