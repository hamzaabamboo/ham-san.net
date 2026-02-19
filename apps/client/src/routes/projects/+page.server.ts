import { graphQLSdk } from '@graphql/sdk';
import { toLegacyFetchProjects } from '@graphql/legacy';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await graphQLSdk.fetchProjects({
    locale: 'en'
  });

  if (data) {
    return {
      data: toLegacyFetchProjects(data)
    };
  }

  error(404, 'Project Not found');
};
