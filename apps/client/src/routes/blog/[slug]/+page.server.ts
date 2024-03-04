import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { graphQLSdk } from '@graphql/sdk';

export const load: PageServerLoad = async ({ params }) => {
  const data = await graphQLSdk.getBlogPostBySlug({
    slug: params.slug
  });

  if (data) {
    return {
      data
    };
  }

  error(404, 'Post Not found');
};
