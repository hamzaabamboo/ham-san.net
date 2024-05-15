import { Tag } from '~/graphql/generated/client';
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

  const projectsCount = tag?.projects?.data.length;

  const colorPalette = (() => {
    switch (type) {
      case 'Frontend':
        return 'blue';
      case 'Backend':
        return 'red';
      case 'Database':
        return 'orange';
      case 'Programming_Language':
        return 'green';
      case 'DevOps':
        return 'purple';
      case 'Others':
        return 'gray';
      case 'Non_Dev':
        return 'gray';
    }
  })();

  return (
    <Badge variant="solid" size={size} colorPalette={colorPalette}>
      {title} {showCount && !!projectsCount && `(${projectsCount})`}
    </Badge>
  );
};
