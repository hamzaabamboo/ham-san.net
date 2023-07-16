import { error } from '@sveltejs/kit';
import { outlineClient } from '@utils/outline-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await outlineClient['/shares.list'].post()

	if (data) {
		return await data.json()
	}

	throw error(404, 'No articles found');
};
