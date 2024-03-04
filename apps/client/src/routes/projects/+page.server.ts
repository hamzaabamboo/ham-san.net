import { graphQLSdk } from '@graphql/sdk';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await graphQLSdk.fetchProjects({
    locale: 'en'
  });

  if (data) {
    return {
      data
    };
  }

  error(404, 'Project Not found');
};
