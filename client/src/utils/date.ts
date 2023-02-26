import { format, parse } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';

export const formatMonthYear = (date: string, locale = 'en') => {
	return format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM yyyy', {
		locale: locale === 'ja' ? ja : enUS
	});
};
