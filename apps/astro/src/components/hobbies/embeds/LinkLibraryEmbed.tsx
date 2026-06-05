import { hobbyStyles } from '../hobbyStyles';
import { getHostLabel } from './source';
import type { HobbyEmbedProps } from './types';

const formatLabel = (label: string, href: string) => {
  if (/^https?:\/\//i.test(label)) return getHostLabel(href);
  return label;
};

export const LinkLibraryEmbed = ({
  links = [],
  description,
  noLinksLabel = 'No external links in this source note.'
}: HobbyEmbedProps) => {
  const visibleLinks = links.slice(0, 8);

  return (
    <div className={hobbyStyles.linkLibrary}>
      {visibleLinks.length > 0 ? (
        visibleLinks.map((link, index) => (
          <a key={`${link.href}-${index}`} href={link.href} target="_blank" rel="noreferrer">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{formatLabel(link.label, link.href)}</strong>
            <small>{getHostLabel(link.href)}</small>
          </a>
        ))
      ) : (
        <p>{description || noLinksLabel}</p>
      )}
    </div>
  );
};
