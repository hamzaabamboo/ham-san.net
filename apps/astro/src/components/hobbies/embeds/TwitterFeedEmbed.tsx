import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

const getHostLabel = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
};

export const TwitterFeedEmbed = ({
  links = [],
  description,
  sourceNoteLabel = 'note',
  noFeedLabel = 'No public feed link is attached to this note.'
}: HobbyEmbedProps) => {
  const feedLinks = links
    .filter((link) => /(x\.com|twitter\.com|bsky\.app|threads\.net|mastodon)/i.test(link.href))
    .slice(0, 3);
  const visibleLinks = feedLinks.length > 0 ? feedLinks : links.slice(0, 3);

  return (
    <div className={hobbyStyles.feed}>
      {visibleLinks.length > 0 ? (
        visibleLinks.map((link) => (
          <article key={link.href}>
            <span>{getHostLabel(link.href)}</span>
            <p>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
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
