import removeMarkdown from 'remove-markdown';

export const cleanArticleContent = (content?: string) => {
  return content?.replaceAll('\\\n', '')?.replaceAll('\\n', '\n\n');
};

export const getArticleBanner = (content?: string) => {
  return (
    /!\[(.*)\]\((.+?)(?:".*?")?\)/
      .exec(content ?? '')?.[2]
      .replaceAll('\\', '')
      .trim() ?? undefined
  );
};
export const getArticleDescription = (content?: string) => {
  return (
    removeMarkdown(content?.replaceAll(/!\[(.*)\]\((.+)\)/g, '') ?? '')
      ?.replaceAll(/\s+/g, ' ')
      .trim()
      .substring(0, 100) + '...'
  );
};
