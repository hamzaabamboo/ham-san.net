import { Enum_Tag_Type } from '~/graphql/generated/client';
import { Badge } from '../ui/badge';

type TagBadgeData = {
  title?: string | null;
  type?: Enum_Tag_Type | null;
  projects?: unknown[] | { data?: unknown[] } | null;
};

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
  const projectsCount = Array.isArray(tag?.projects)
    ? tag.projects.filter(Boolean).length
    : Array.isArray((tag.projects as { data?: unknown[] } | null)?.data)
      ? ((tag.projects as { data?: unknown[] }).data?.length ?? 0)
      : 0;

  const colorPalette = 'amber';

  return (
    <Badge variant="outline" size={size} colorPalette={colorPalette} textTransform="uppercase">
      {title} {showCount && !!projectsCount && `(${projectsCount})`}
    </Badge>
  );
};
