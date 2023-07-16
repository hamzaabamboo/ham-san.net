import { error } from '@sveltejs/kit';
import { outlineClient } from '@utils/outline-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const res = await outlineClient['/shares.list'].post()
	
	if (!res.ok) {
		throw error(500, 'Something went wrong');
	}
	const data = await res.json();
	if (data?.data?.length === 0) {
		throw error(404, 'No articles found');
	}
	return data;
};
