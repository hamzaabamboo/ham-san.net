import { dedupeHobbyLinks } from '~/utils/hobby-links';
import { hobbyStyles } from '../hobbyStyles';
import { getHostLabel, getLinkTileParts } from './source';
import type { HobbyEmbedProps } from './types';

const formatLabel = (label: string, href: string) => {
  if (/^https?:\/\//i.test(label)) return getHostLabel(href);
  return label;
};

export const LinkLibraryEmbed = ({
  links = [],
  description,
  noLinksLabel = 'No external links in this note.'
}: HobbyEmbedProps) => {
  const visibleLinks = dedupeHobbyLinks(links);

  return (
    <div className={`${hobbyStyles.linkLibrary} hobby-meta`}>
      {visibleLinks.length > 0 ? (
        visibleLinks.map((link, index) => {
          const parts = getLinkTileParts({
            href: link.href,
            label: formatLabel(link.label, link.href)
          });
          return (
            <a key={`${link.href}-${index}`} href={link.href} target="_blank" rel="noreferrer">
              <strong>{parts.label}</strong>
              {parts.detail && <small>{parts.detail}</small>}
            </a>
          );
        })
      ) : (
        <p>{description || noLinksLabel}</p>
      )}
    </div>
  );
};
