export type MediaOptions = {
  format?: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
};

export const getMediaUrl = (path?: string, options: MediaOptions = {}, server: string) => {
  if (!path) return undefined;
  const { format = 'webp', width, height, fit = 'inside' } = options;
  if (path?.startsWith('http://')) return path;
  let query = `?format=${format}&q=75`;
  if (width && height) {
    query += `&resize=${width}x${height}&fit=${fit}`;
  } else {
    if (width) query += `&w=${width}`;
    if (height) query += `&h=${height}`;
  }

  if (path?.includes('.gif')) query += '&animated=True';
  return server + path + query;
};
