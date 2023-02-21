import { error } from '@sveltejs/kit';
import { graphQLClient } from '@graphql';

import { FetchAboutMeDocument, type FetchAboutMeQuery } from '@graphql/generated/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data: FetchAboutMeQuery = await graphQLClient.request(FetchAboutMeDocument, {
		slug: params.slug
	});

	if (data) {
		return {
			data
		};
	}

	throw error(404, 'Project Not found');
};
