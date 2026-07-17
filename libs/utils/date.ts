export const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return new Date(Number.NaN);
  return new Date(year, month - 1, day);
};

const intlLocale = (locale: string) =>
  locale === 'ja' ? 'ja-JP' : locale === 'th' ? 'th-TH' : 'en-US';

const formatRelativeUnit = (
  value: number,
  unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second',
  locale: string
) => {
  if (locale === 'ja') {
    const units = {
      year: '年',
      month: 'か月',
      week: '週間',
      day: '日',
      hour: '時間',
      minute: '分',
      second: '秒'
    };
    return `${value}${units[unit]}`;
  }

  if (locale === 'th') {
    const units = {
      year: 'ปี',
      month: 'เดือน',
      week: 'สัปดาห์',
      day: 'วัน',
      hour: 'ชั่วโมง',
      minute: 'นาที',
      second: 'วินาที'
    };
    return `${value} ${units[unit]}`;
  }

  return `${value} ${unit}${value === 1 ? '' : 's'}`;
};

export const formatDistanceBetween = (start: Date, end: Date, locale = 'en') => {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
  const [first, last] = start.getTime() <= end.getTime() ? [start, end] : [end, start];
  const months =
    (last.getFullYear() - first.getFullYear()) * 12 + (last.getMonth() - first.getMonth()) + 1;
  if (months >= 12) return formatRelativeUnit(Math.floor(months / 12), 'year', locale);
  return formatRelativeUnit(Math.max(1, months), 'month', locale);
};

export const formatDistanceToNow = (date: Date, locale = 'en') =>
  formatDistanceBetween(date, new Date(), locale);

export const formatMonthYear = (date: Date, locale = 'en') => {
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: 'numeric',
    month: 'long'
  }).format(date);
};
