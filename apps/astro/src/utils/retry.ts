export const retryOnce = async <T>(operation: () => Promise<T>) => {
  try {
    return await operation();
  } catch {
    return operation();
  }
};
