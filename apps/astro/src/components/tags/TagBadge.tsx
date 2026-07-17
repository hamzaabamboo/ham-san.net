import { Enum_Tag_Type } from '~/graphql/generated/client';
import { Badge } from '../ui/badge';

type TagRelation = unknown[] | { data?: unknown[] } | null;

type TagBadgeData = {
  title?: string | null;
  type?: Enum_Tag_Type | null;
  projects?: TagRelation;
  experiences?: TagRelation;
};

const relationCount = (relation?: TagRelation) =>
  Array.isArray(relation)
    ? relation.filter(Boolean).length
    : Array.isArray(relation?.data)
      ? relation.data.filter(Boolean).length
      : 0;

export const TagBadge = ({
  tag,
  showCount = false,
  size
}: {
  tag: TagBadgeData;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const { title } = tag;
  const count = relationCount(tag.projects) + relationCount(tag.experiences);

  const colorPalette = 'amber';

  return (
    <Badge variant="outline" size={size} colorPalette={colorPalette} textTransform="uppercase">
      {title} {showCount && `(${count})`}
    </Badge>
  );
};
