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
  emptySourceLabel = 'Waiting for note content.',
  emptySourceStateLabel,
  nestedSourcePagesLabel = 'Related pages',
  sourceNoteAttachedLabel = 'Note content available',
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
      : (emptySourceStateLabel ?? emptySourceLabel);
  const lineItems = [
    [statusMetricLabel, statusLabel || status],
    [updatedMetricLabel, updatedAt ?? liveContentLabel],
    ...(links.length > 0 ? [[linksMetricLabel, String(links.length)]] : []),
    ...(nestedPages.length > 0 ? [[pagesMetricLabel, String(nestedPages.length)]] : [])
  ];

  return (
    <div className={hobbyStyles.fieldNotes}>
      <HobbyTypeGlyph type="field-notes" size="hero" />
      <div>
        <p>{sourceState}</p>
        <strong>{title ?? 'Note links'}</strong>
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
      <dl className="hobby-meta">
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
