import { API_URL } from './domain';

type MediaOptions = {
	format?: string;
	width?: number;
	height?: number;
};

export const getMediaUrl = (path?: string, options: MediaOptions = {}) => {
	const { format = 'webp', width, height } = options;
	if (path?.startsWith('http://')) return path;
	let query = `?format=${format}`;
	if (width) query += `&w=${width}`;
	if (height) query += `&h=${height}`;
	if (path?.includes('.gif')) query += '&animated=True';
	return API_URL + path + query;
};
