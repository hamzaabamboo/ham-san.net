//TODO: Fix type errors
import { error } from '@sveltejs/kit';
import { outlineClient, type OutlineAPI } from '@utils/outline-api';
import type { OASOutput } from 'fets';
import type { PageServerLoad } from './$types';

const headers = {
  Authorization: undefined as unknown as 'Bearer hoge'
};

export const load: PageServerLoad = async () => {
  const res = await outlineClient['/shares.list'].post({
    json: {
      sort: 'createdAt',
      direction: 'DESC'
    },
    headers
  });

  if (!res.ok) {
    error(500, 'Something went wrong');
  }
  const data = await res.json();
  if (data?.data?.length === 0) {
    error(404, 'No articles found');
  }

  return {
    data: data.data as (NonNullable<
      OASOutput<OutlineAPI, '/shares.list', 'post'>['data']
    >[number] & {
      collectionName: string;
      documentSummary: string;
      documentCreatedAt: string;
    })[]
  };
};
