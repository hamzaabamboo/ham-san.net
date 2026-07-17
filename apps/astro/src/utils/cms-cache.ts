const lastGood = new Map<string, unknown>();
const MAX_ENTRIES = 256;

export const withLastGoodState = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  shouldStore?: (value: T) => boolean
) => {
  try {
    const value = await fetcher();
    if (!shouldStore || shouldStore(value)) {
      if (!lastGood.has(key) && lastGood.size >= MAX_ENTRIES) {
        const oldest = lastGood.keys().next().value;
        if (oldest !== undefined) lastGood.delete(oldest);
      }
      lastGood.set(key, value);
    }
    return { value, fromCache: false };
  } catch (error) {
    if (lastGood.has(key)) {
      return { value: lastGood.get(key) as T, fromCache: true };
    }
    throw error;
  }
};

export const withLastGood = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  shouldStore?: (value: T) => boolean
): Promise<T> => {
  const { value } = await withLastGoodState(key, fetcher, shouldStore);
  return value;
};
