import { formatDistanceToNow as _formatDistanceToNow, format, parse } from 'date-fns';
import enUS from 'date-fns/locale/en-US/index.js';
import ja from 'date-fns/locale/ja/index.js';

export const parseDate = (date: string) => parse(date, 'yyyy-MM-dd', new Date());

export const formatMonthYear = (date: Date, locale = 'en') => {
  return format(date, locale === 'ja' ? 'yyyy年 MMMM' : 'MMMM yyyy', {
    locale: locale === 'ja' ? ja : enUS
  });
};

export const formatDistanceToNow = (date: Date, locale = 'en') => {
  return _formatDistanceToNow(date, {
    locale: locale === 'ja' ? ja : enUS
  });
};
