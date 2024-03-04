import { error } from '@sveltejs/kit';
import { cleanArticleContent, getArticleBanner, getArticleDescription } from '@utils/article';
import { outlineClient } from '@utils/outline-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const res = await outlineClient['/shares.list'].post({
    json: {
      sort: 'createdAt',
      direction: 'DESC'
    }
  });

  if (!res.ok) {
    console.log(await res.json());
    error(500, 'Something went wrong');
  }
  const data = await res.json();
  if (data?.data?.length === 0) {
    error(404, 'No articles found');
  }

  const collectionInfoRes = await outlineClient['/collections.list'].post();
  const collectionInfo = collectionInfoRes?.ok ? (await collectionInfoRes.json())?.data : undefined;

  const promises = data.data?.map(async (article) => {
    const r = await outlineClient['/documents.info'].post({ json: { shareId: article.id } });
    const d = r.ok ? (await r.json())?.data : undefined;
    const content = cleanArticleContent(d?.text);
    const banner = getArticleBanner(content);
    const description = getArticleDescription(content);

    return {
      title: d?.title,
      urlId: article?.urlId,
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
