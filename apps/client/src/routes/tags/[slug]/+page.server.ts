import { graphQLSdk } from '@graphql/sdk';
import { toLegacyGetTagBySlug } from '@graphql/legacy';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const data = await graphQLSdk.getTagBySlug({
    slug: params.slug,
    locale: 'all'
  });

  if (data) {
    return {
      data: toLegacyGetTagBySlug(data)
    };
  }

  error(404, 'Project Not found');
};
