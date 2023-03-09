import { Enum_Tag_Type, type TagEntity } from '@graphql/generated/client';

const SORT_ORDER = [
	Enum_Tag_Type.Frontend,
	Enum_Tag_Type.Backend,
	Enum_Tag_Type.ProgrammingLanguage,
	Enum_Tag_Type.Database,
	Enum_Tag_Type.DevOps,
	Enum_Tag_Type.NonDev,
	Enum_Tag_Type.Others
];

const getTypeOrder = (tag: TagEntity) =>
	tag.attributes?.type && SORT_ORDER.includes(tag.attributes.type)
		? SORT_ORDER.indexOf(tag.attributes.type)
		: Infinity;

export const sortTags = (tags: TagEntity[]) => {
	return [...tags].sort((a, b) => {
		if (!a.attributes || !b.attributes) return 0;
		if (a.attributes.order && b.attributes.order) return a.attributes.order - b.attributes.order;
		else if (!a.attributes.order && !b.attributes.order) {
			return getTypeOrder(a) - getTypeOrder(b);
		} else {
			return (a.attributes.order || b.attributes.order) as number;
		}
	});
};
