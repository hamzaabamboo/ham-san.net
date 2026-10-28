const lastGood = new Map<string, unknown>();
const MAX_ENTRIES = 256;
const fresh = new Map<string, { value: unknown; storedAt: number }>();
const inFlight = new Map<string, Promise<{ value: unknown; fromCache: boolean }>>();

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

export const withFreshLastGoodState = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  maxAge = 60_000
): Promise<{ value: T; fromCache: boolean }> => {
  const cached = fresh.get(key);
  const age = cached ? Date.now() - cached.storedAt : Infinity;
  if (cached && age >= 0 && age < maxAge) {
    return { value: cached.value as T, fromCache: false };
  }

  const pending = inFlight.get(key);
  if (pending) return pending as Promise<{ value: T; fromCache: boolean }>;

  const request = withLastGoodState(key, fetcher)
    .then((result) => {
      if (!result.fromCache) {
        fresh.delete(key);
        fresh.set(key, { value: result.value, storedAt: Date.now() });
        if (fresh.size > MAX_ENTRIES) {
          const oldest = fresh.keys().next().value;
          if (oldest !== undefined) fresh.delete(oldest);
        }
      }
      return result;
    })
    .catch((error) => {
      if (cached) return { value: cached.value as T, fromCache: true };
      throw error;
    })
    .finally(() => inFlight.delete(key));
  inFlight.set(key, request);
  return request;
};
