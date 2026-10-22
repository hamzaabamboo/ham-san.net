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
  size,
  current = false,
  interactive = false
}: {
  tag: TagBadgeData;
  showCount?: boolean;
  countLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  current?: boolean;
  interactive?: boolean;
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
      borderColor={current ? 'var(--atelier-accent)' : 'var(--atelier-line)'}
      color={current ? 'var(--atelier-fg)' : 'var(--atelier-fg-muted)'}
      fontFamily="var(--font-code)"
      textTransform="uppercase"
      bg={current ? 'var(--atelier-surface-high)' : undefined}
      transition="colors"
      _groupFocusVisible={
        interactive && !current
          ? { borderColor: 'var(--atelier-accent)', color: 'var(--atelier-fg)' }
          : undefined
      }
      _groupHover={
        interactive && !current
          ? { borderColor: 'var(--atelier-accent)', color: 'var(--atelier-fg)' }
          : undefined
      }
    >
      {title}
      {showCount && ' '}
      <span
        aria-hidden="true"
        title={countLabel}
        className={css({ color: 'var(--atelier-outline)' })}
      >
        {showCount && `(${count})`}
      </span>
      {showCount && countLabel && <span className={css({ srOnly: true })}>{countLabel}</span>}
    </Badge>
  );
};
