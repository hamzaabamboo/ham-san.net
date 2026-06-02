export const getOutlineAssetProxyPath = (locale?: string) =>
  locale ? `/${locale}/api/outline-asset` : '/api/outline-asset';

export const resolveOutlineAssetUrl = (
  rawUrl?: string,
  {
    assetsPrefix,
    assetProxyBasePath = '/api/outline-asset'
  }: { assetsPrefix?: string; assetProxyBasePath?: string } = {}
) => {
  const value = rawUrl
    ?.trim()
    .replace(/^["']|["']$/g, '')
    .replace(/&amp;/g, '&');
  if (!value) return value;
  if (value.startsWith('data:')) return value;

  if (value.includes('attachments.redirect')) {
    const query = value.split('?')[1];
    if (query) {
      const params = new URLSearchParams(query);
      const id = params.get('id')?.match(/[0-9a-f-]{36}/i)?.[0];
      if (id) {
        params.set('id', id);
        return `${assetProxyBasePath}?${params.toString()}`;
      }
      return `${assetProxyBasePath}?${query}`;
    }
    if (!assetsPrefix || /^(?:[a-z]+:)?\/\//i.test(value)) return value;
  }

  if (/^(?:[a-z]+:)?\/\//i.test(value)) return value;
  if (!assetsPrefix) return value;

  const normalizedUrl = value.startsWith('/') ? value : `/${value.replace(/^\.?\/*/, '')}`;
  return `${assetsPrefix}${normalizedUrl}`;
};
