import { graphQLSdk } from '@graphql/sdk';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const data = await graphQLSdk.fetchHomePage({
		locale: cookies.get('language') ?? 'all'
	});

	if (data) {
		return {
			data
		};
	}
};

export const actions: Actions = {
	['set-language']: async ({ cookies, request }) => {
		const language = (await request.formData()).get('language');
		if (language) {
			cookies.set('language', language as string);
		}
	}
};
