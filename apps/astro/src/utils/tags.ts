import { toKebabCase } from 'utils/kebab-case';
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

export const tagSlug = (tag: { title?: string | null; slug?: string | null }) =>
  tag.title ? toKebabCase(tag.title) : (tag.slug ?? '');

const getTypeOrder = (tag: TagLike) => {
  const normalizedType = tag?.type ? String(tag.type) : undefined;
  return normalizedType && SORT_ORDER.includes(normalizedType)
    ? SORT_ORDER.indexOf(normalizedType)
    : Infinity;
};

export const sortTags = <T extends TagLike>(tags: T[]): T[] => {
  return [...tags].sort((a, b) => {
    if (!a || !b) return 0;
    const aOrder = a.order ?? null;
    const bOrder = b.order ?? null;
    if (aOrder !== null && bOrder !== null) return aOrder - bOrder;
    if (aOrder !== null) return -1;
    if (bOrder !== null) return 1;
    return getTypeOrder(a) - getTypeOrder(b);
  });
};
