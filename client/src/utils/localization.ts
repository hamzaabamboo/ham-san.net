export const LANGUAGES = ['en', 'ja'];

export const getLocalizedItems = <
	T extends { locale?: string | null },
	A extends { data?: I[] },
	I extends { attributes?: T | null },
	L extends { localizations?: A | null }
>(
	data?: L | null,
	locale = 'en'
): T | undefined | null => {
	if (!data) return;
	const items = data?.localizations?.data;
	return items?.find((d) => d?.attributes?.locale === locale)?.attributes ?? items?.[0]?.attributes;
};
