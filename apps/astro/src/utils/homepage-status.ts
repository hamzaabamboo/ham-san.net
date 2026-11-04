import type { Languages } from '~/i18n/ui';
import { withFreshLastGoodState } from './cms-cache';

export const getHomepageStatus = async (locale: Languages): Promise<string | null | undefined> => {
  const base =
    process.env.PRIVATE_BACKEND_API_URL ??
    import.meta.env.PRIVATE_BACKEND_API_URL ??
    process.env.PUBLIC_API_URL ??
    import.meta.env.PUBLIC_API_URL;
  if (!base) return null;

  try {
    const url = new URL(`${base.replace(/\/+$/, '')}/api/homepage`);
    url.searchParams.set('locale', locale);
    const result = await withFreshLastGoodState(`homepage-status:${url.href}`, async () => {
      const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (response.status === 404) {
        if (locale === 'en') return null;
        const referenceUrl = new URL(url);
        referenceUrl.searchParams.set('locale', 'en');
        const reference = await fetch(referenceUrl, { signal: AbortSignal.timeout(7000) });
        if (!reference.ok) throw new Error(`Homepage status failed with HTTP ${reference.status}.`);
        const { data } = await reference.json();
        return data && Object.hasOwn(data, 'currentFocus') ? null : undefined;
      }
      if (!response.ok) throw new Error(`Homepage status failed with HTTP ${response.status}.`);
      const { data } = await response.json();
      if (!data || !Object.hasOwn(data, 'currentFocus')) {
        return undefined;
      }
      if (data.currentFocus !== null && typeof data.currentFocus !== 'string') {
        throw new Error('Homepage status returned invalid fields.');
      }
      return data.currentFocus?.trim() || null;
    });
    return result.value;
  } catch {
    return null;
  }
};
