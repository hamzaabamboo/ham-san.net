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

export const mergeLocaleRecords = <T extends { documentId: string; start?: string | null }>(
  preferred: Array<T | null> | null | undefined,
  fallback: Array<T | null> | null | undefined
): T[] => {
  const records = new Map<string, T>();
  for (const item of fallback ?? []) if (item) records.set(item.documentId, item);
  for (const item of preferred ?? []) if (item) records.set(item.documentId, item);
  return Array.from(records.values()).sort((a, b) => (b.start ?? '').localeCompare(a.start ?? ''));
};

export const pickCurrentLocaleRecord = <
  T extends { locale?: string | null; start?: string | null; end?: string | null }
>(
  records: Array<WithLocalizations<T> | null> | null | undefined,
  locale: string,
  today: string
) =>
  records?.find((item) => {
    const record = pickLocale(item, locale);
    return (
      record && (!record.start || record.start <= today) && (!record.end || record.end >= today)
    );
  }) ?? null;
