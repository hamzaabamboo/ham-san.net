const API_URL = 'http://localhost:1337';

export const getMediaUrl = (path?: string) => {
	if (path?.startsWith('http://')) return path;
	return API_URL + path;
};
