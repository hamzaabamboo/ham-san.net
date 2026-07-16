import { getSocialFeedLinks } from '~/utils/hobby-links';
import { hobbyStyles } from '../hobbyStyles';
import { getHostLabel, getPathLabel } from './source';
import type { HobbyEmbedProps } from './types';

export const TwitterFeedEmbed = ({
  links = [],
  description,
  sourceNoteLabel = 'note',
  noFeedLabel = 'No public feed link is attached to this note.'
}: HobbyEmbedProps) => {
  const feedLinks = getSocialFeedLinks(links);

  return (
    <div className={hobbyStyles.feed}>
      {feedLinks.length > 0 ? (
        feedLinks.map((link) => (
          <article key={link.href}>
            <span>{getHostLabel(link.href)}</span>
            <p>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label === getHostLabel(link.href) ? getPathLabel(link.href) : link.label}
              </a>
            </p>
          </article>
        ))
      ) : (
        <article>
          <span>{sourceNoteLabel}</span>
          <p>{description || noFeedLabel}</p>
        </article>
      )}
    </div>
  );
};
