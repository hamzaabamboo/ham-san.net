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
  const plainText = (content ?? '')
    .replaceAll(/!\[(.*)\]\((.+)\)/g, '')
    .replaceAll(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replaceAll(/(\*\*|__)(.*?)\1/g, '$2')
    .replaceAll(/(\*|_)(.*?)\1/g, '$2')
    .replaceAll(/^>\s+/gm, '')
    .replaceAll(/^#+\s+/gm, '')
    .replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replaceAll(/[*_~]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim();

  return (
    plainText.substring(0, 100) + '...'
  );
};
