import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { graphQLSdk } from '@graphql/sdk';

export const load: PageServerLoad = async ({ cookies }) => {
  const data = await graphQLSdk.fetchBlogPosts({
    locale: cookies.get('language') ?? 'all'
  });

  if (data) {
    return {
      data
    };
  }

  error(404, 'Blog Posts Not found');
};
