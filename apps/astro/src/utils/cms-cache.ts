const lastGood = new Map<string, unknown>();

export const withLastGood = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  try {
    const value = await fetcher();
    lastGood.set(key, value);
    return value;
  } catch (error) {
    if (lastGood.has(key)) {
      return lastGood.get(key) as T;
    }
    throw error;
  }
};
