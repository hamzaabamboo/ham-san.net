import { graphQLSdk } from '@graphql/sdk';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data = await graphQLSdk.getTagBySlug({
		slug: params.slug,
		locale: 'all'
	});

	if (data) {
		return {
			data
		};
	}

	throw error(404, 'Project Not found');
};
