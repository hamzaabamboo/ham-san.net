import { graphQLSdk } from '@graphql/sdk';
import { toLegacyFetchHomePage } from '@graphql/legacy';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const data = await graphQLSdk.fetchHomePage({
    locale: cookies.get('language') ?? 'all'
  });

  if (data) {
    return {
      data: toLegacyFetchHomePage(data)
    };
  }
};

export const actions: Actions = {
  ['set-language']: async ({ cookies, request }) => {
    const language = (await request.formData()).get('language');
    if (language) {
      /* @migration task: add path argument */ cookies.set('language', language as string, {
        path: '/'
      });
    }
  }
};
