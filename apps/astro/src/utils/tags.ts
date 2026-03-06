import type { Enum_Tag_Type } from '~/graphql/generated/client';

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

type TagLike = { type?: Enum_Tag_Type | string | null; order?: number | null } | null | undefined;

const getTypeOrder = (tag: TagLike) => {
  const normalizedType = tag?.type ? String(tag.type) : undefined;
  return normalizedType && SORT_ORDER.includes(normalizedType)
    ? SORT_ORDER.indexOf(normalizedType)
    : Infinity;
};

export const sortTags = <T extends TagLike>(tags: T[]): T[] => {
  return [...tags].sort((a, b) => {
    if (!a || !b) return 0;
    if (a.order && b.order) return a.order - b.order;
    else if (!a.order && !b.order) {
      return getTypeOrder(a) - getTypeOrder(b);
    } else {
      return (a.order || b.order) as number;
    }
  });
};
