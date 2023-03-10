import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { graphQLSdk } from '@graphql/sdk';

export const load: PageServerLoad = async ({ params }) => {
	const data = await graphQLSdk.getProjectBySlug({
		slug: params.slug
	});

	if (data) {
		return {
			data
		};
	}

	throw error(404, 'Project Not found');
};
