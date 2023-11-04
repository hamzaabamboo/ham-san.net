import { graphQLSdk } from '@graphql/sdk';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const data = await graphQLSdk.getProjectBySlug({
    slug: params.slug
  });

  if (data) {
    const locale = data.projects?.data?.[0]?.attributes?.locale;
    if (locale) {
      cookies.set('language', locale);
    }
    return {
      data,
      currentLanguage: locale
    };
  }

  throw error(404, 'Project Not found');
};
