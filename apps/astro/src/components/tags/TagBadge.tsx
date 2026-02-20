import { Enum_Tag_Type, Tag } from '~/graphql/generated/client';
import { Badge } from '../ui/badge';

export const TagBadge = ({
  tag,
  showCount = false,
  size
}: {
  tag: Tag;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const { title, type } = tag;
  const projectsCount = Array.isArray(tag?.projects)
    ? tag.projects.filter(Boolean).length
    : Array.isArray((tag as { projects?: { data?: unknown[] } }).projects?.data)
      ? (((tag as { projects?: { data?: unknown[] } }).projects?.data?.length ?? 0) as number)
      : 0;

  const colorPalette = (() => {
    switch (type) {
      case Enum_Tag_Type.Frontend:
        return 'blue';
      case Enum_Tag_Type.Backend:
        return 'red';
      case Enum_Tag_Type.Database:
        return 'orange';
      case Enum_Tag_Type.ProgrammingLanguage:
        return 'green';
      case Enum_Tag_Type.DevOps:
        return 'purple';
      case Enum_Tag_Type.Others:
        return 'gray';
      case Enum_Tag_Type.NonDev:
        return 'gray';
    }
  })();

  return (
    <Badge variant="solid" size={size} colorPalette={colorPalette}>
      {title} {showCount && !!projectsCount && `(${projectsCount})`}
    </Badge>
  );
};
