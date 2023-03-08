import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { graphQLSdk } from '@graphql/sdk';

export const load: PageServerLoad = async ({ cookies }) => {
	const data = await graphQLSdk.fetchAboutMe({
		locale: cookies.get('language') ?? 'all'
	});

	if (data) {
		return {
			data
		};
	}

	throw error(404, 'Project Not found');
};
