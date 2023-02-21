import type { Actions } from './$types';

export const actions: Actions = {
	['set-language']: async ({ cookies, request }) => {
		const language = (await request.formData()).get('language');
		if (language) {
			cookies.set('language', language as string);
		}
	}
};
