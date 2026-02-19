import { graphQLSdk } from '@graphql/sdk';
import { toLegacyGetProjectBySlug } from '@graphql/legacy';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const raw = await graphQLSdk.getProjectBySlug({
    slug: params.slug
  });

  if (raw) {
    const data = toLegacyGetProjectBySlug(raw);
    const locale = data.projects?.data?.[0]?.attributes?.locale;
    if (locale) {
      /* @migration task: add path argument */ cookies.set('language', locale, { path: '/' });
    }
    return {
      data,
      currentLanguage: locale
    };
  }

  error(404, 'Project Not found');
};
