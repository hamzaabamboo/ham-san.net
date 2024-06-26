//TODO: Fix type errors
import { error } from '@sveltejs/kit';
import { outlineClient } from '@utils/outline-api';
import { cleanArticleContent, getArticleBanner, getArticleDescription } from 'outline/article';
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

  const collectionInfoRes = await outlineClient['/collections.list'].post({ headers });
  const collectionInfo = collectionInfoRes?.ok ? (await collectionInfoRes.json())?.data : undefined;

  const promises = data.data?.map(async (article) => {
    const r = await outlineClient['/documents.info'].post({
      json: { shareId: article.id },
      headers
    });
    const d = r.ok ? (await r.json())?.data : undefined;
    const content = cleanArticleContent(d?.text);
    const banner = getArticleBanner(content);
    const description = getArticleDescription(content);

    return {
      title: d?.title,
      urlId: (article as { urlId: string })?.urlId,
      collection: d?.collectionId,
      collectionName: collectionInfo?.find((c) => c?.id === d?.collectionId)?.name,
      banner,
      description,
      createdAt: d?.createdAt
    };
  });
  const postPreviews = await Promise.all(promises ?? []);

  return {
    data: postPreviews
  };
};
