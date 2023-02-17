import { API_URL } from './domain';

export const getMediaUrl = (path?: string) => {
	if (path?.startsWith('http://')) return path;
	return API_URL + path;
};
