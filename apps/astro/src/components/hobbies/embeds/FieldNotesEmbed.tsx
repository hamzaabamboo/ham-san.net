import { dedupeHobbyLinks } from '~/utils/hobby-links';
import { HobbyTypeGlyph } from '../HobbyTypeGlyph';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const FieldNotesEmbed = ({
  title,
  body = '',
  links = [],
  nestedPages = [],
  emptySourceLabel = 'Source material pending.',
  emptySourceStateLabel,
  nestedSourcePagesLabel = 'Related pages',
  sourceNoteAttachedLabel = 'Note content available'
}: HobbyEmbedProps) => {
  const sourceState = body
    ? sourceNoteAttachedLabel
    : nestedPages.length > 0
      ? nestedSourcePagesLabel
      : (emptySourceStateLabel ?? emptySourceLabel);
  const sourceLinks = dedupeHobbyLinks(links);

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
        {sourceLinks.length > 0 && (
          <nav>
            {sourceLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};
