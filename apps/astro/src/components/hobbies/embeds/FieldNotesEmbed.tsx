import { HobbyTypeGlyph } from '../HobbyTypeGlyph';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const FieldNotesEmbed = ({
  title,
  body = '',
  links = [],
  nestedPages = [],
  updatedAt,
  statusLabel = 'Active',
  liveContentLabel = 'Live',
  emptySourceLabel = 'Waiting for source notes.',
  nestedSourcePagesLabel = 'Nested source pages',
  sourceNoteAttachedLabel = 'Source note attached',
  statusMetricLabel = 'Status',
  linksMetricLabel = 'Links',
  updatedMetricLabel = 'Updated',
  pagesMetricLabel = 'Pages',
  status = 'active'
}: HobbyEmbedProps) => {
  const sourceState = body
    ? sourceNoteAttachedLabel
    : nestedPages.length > 0
      ? nestedSourcePagesLabel
      : emptySourceLabel;
  const lineItems = [
    [statusMetricLabel, statusLabel || status],
    [linksMetricLabel, String(links.length)],
    [updatedMetricLabel, updatedAt ?? liveContentLabel],
    [pagesMetricLabel, String(nestedPages.length)]
  ];

  return (
    <div className={hobbyStyles.fieldNotes}>
      <HobbyTypeGlyph type="field-notes" size="hero" />
      <div>
        <p>{sourceState}</p>
        <strong>{title ?? 'Field notes'}</strong>
        {nestedPages.length > 0 && (
          <nav>
            {nestedPages.slice(0, 4).map((page) => (
              <a key={page.href} href={page.href}>
                {page.title}
              </a>
            ))}
          </nav>
        )}
      </div>
      <dl>
        {lineItems.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
