import { error, type Load } from '@sveltejs/kit';
import { graphQLClient } from '../../../graphql';

import { GetProjectBySlugDocument } from '../../../graphql/generated/server';

/** @type {import('./$types').PageServerLoad} */
export const load: Load = async ({ params }) => {
	const data = await graphQLClient.request(GetProjectBySlugDocument, {
		slug: params.slug
	});

	if (data) {
		return data;
	}

	throw error(404, 'Project Not found');
};
