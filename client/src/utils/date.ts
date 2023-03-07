import format from 'date-fns/format';
import parse from 'date-fns/parse';
import _formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { enUS, ja } from 'date-fns/locale';

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
