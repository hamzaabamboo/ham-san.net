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
    : (data.attributes?.localizations?.data?.find((p) => p.attributes?.locale === locale)
        ?.attributes ?? data.attributes);
};

type WithLocalizations<T extends { locale?: string | null }> = T & {
  localizations: Array<T | null>;
};

export const pickLocale = <T extends { locale?: string | null }>(
  item: WithLocalizations<T> | null | undefined,
  locale: string
): T | null => {
  if (!item) return null;
  if (item.locale === locale) return item;
  const localized = item.localizations?.find((l) => l?.locale === locale);
  return (localized as T) ?? item;
};
