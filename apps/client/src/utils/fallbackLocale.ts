export type DataWithLocale<D extends { locale?: string | null | undefined }> = {
	attributes?:
		| (D & { localizations?: { data?: { attributes?: D | null }[] | null } | null })
		| null;
};

export const fallbackLocale = <D extends { locale?: string | null | undefined }>(
	data: DataWithLocale<D>,
	locale = 'en'
) => {
	return locale === data.attributes?.locale
		? data.attributes
		: data.attributes?.localizations?.data?.find((p) => p.attributes?.locale === locale)
				?.attributes ?? data.attributes;
};
