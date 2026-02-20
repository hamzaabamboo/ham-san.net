import type { Tag } from '~/graphql/generated/client';

const SORT_ORDER = [
  'Frontend',
  'Backend',
  'Programming_Language',
  'ProgrammingLanguage',
  'Database',
  'Dev_Ops',
  'DevOps',
  'Non_Dev',
  'NonDev',
  'Others'
];

type TagLike = { attributes?: Tag | null } | Tag | null | undefined;

const unwrapTag = (tag: TagLike): Tag | null =>
  (tag && 'attributes' in tag ? ((tag.attributes as Tag | null | undefined) ?? null) : (tag as Tag | null)) ?? null;

const getTypeOrder = (tag: TagLike) => {
  const value = unwrapTag(tag);
  const normalizedType = value?.type ? String(value.type) : undefined;
  return normalizedType && SORT_ORDER.includes(normalizedType)
    ? SORT_ORDER.indexOf(normalizedType)
    : Infinity;
};

export const sortTags = (tags: TagLike[]) => {
  return [...tags].sort((a, b) => {
    const tagA = unwrapTag(a);
    const tagB = unwrapTag(b);
    if (!tagA || !tagB) return 0;
    if (tagA.order && tagB.order) return tagA.order - tagB.order;
    else if (!tagA.order && !tagB.order) {
      return getTypeOrder(a) - getTypeOrder(b);
    } else {
      return (tagA.order || tagB.order) as number;
    }
  });
};
