import { css } from 'styled-system/css';
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

export const tagLinkCount = (tag: TagBadgeData) =>
  relationCount(tag.projects) + relationCount(tag.experiences);

export const TagBadge = ({
  tag,
  showCount = false,
  countLabel,
  size
}: {
  tag: TagBadgeData;
  showCount?: boolean;
  countLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const { title } = tag;
  const count = tagLinkCount(tag);

  // Tag chips are inventory, not signal: the same tag names render in `--atelier-outline`
  // grey on the project cards. Amber is reserved for the hovered/active chip.
  //
  // The Atelier tokens directly, not a Park-UI palette: `colorPalette="gray"` is aliased
  // onto the Radix MAUVE ramp in panda.config.ts, so it painted a cool purple-grey border
  // (#3c393f) and a cool near-white (#eeeef0) beside the warm --atelier-line and
  // --atelier-fg on the same screen — trading one off-system hue for another.
  return (
    <Badge
      variant="outline"
      size={size}
      borderColor="var(--atelier-line)"
      color="var(--atelier-fg-muted)"
      textTransform="uppercase"
    >
      {title}
      {showCount && ' '}
      <span aria-hidden="true" title={countLabel}>
        {showCount && `(${count})`}
      </span>
      {showCount && countLabel && <span className={css({ srOnly: true })}>{countLabel}</span>}
    </Badge>
  );
};
