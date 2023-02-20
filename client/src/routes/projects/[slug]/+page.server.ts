import { error } from '@sveltejs/kit';
import { graphQLClient } from '../../../graphql';

import {
	GetProjectBySlugDocument,
	type GetProjectBySlugQuery
} from '../../../graphql/generated/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data: GetProjectBySlugQuery = await graphQLClient.request(GetProjectBySlugDocument, {
		slug: params.slug
	});

	if (data) {
		return {
			data
		};
	}

	throw error(404, 'Project Not found');
};
