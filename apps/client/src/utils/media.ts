import { getMediaUrl as _getMediaUrl, type MediaOptions } from 'utils/media';
import { API_URL } from './domain';

export const getMediaUrl = (path: string, options?: MediaOptions) =>
  _getMediaUrl(path, options, API_URL);
