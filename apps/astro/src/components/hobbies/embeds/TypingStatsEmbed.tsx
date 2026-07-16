import { getTypingProfileLinks } from '~/utils/hobby-links';
import { hobbyStyles } from '../hobbyStyles';
import { getLinkTileParts } from './source';
import type { HobbyEmbedProps } from './types';

export const TypingStatsEmbed = ({
  links = [],
  noTypingProfilesLabel = 'No typing profiles are linked yet.'
}: HobbyEmbedProps) => {
  const visibleLinks = getTypingProfileLinks(links);

  return (
    <div className={hobbyStyles.sourceModule}>
      {visibleLinks.length > 0 ? (
        <div className={`${hobbyStyles.sourceLinks} hobby-meta`}>
          {visibleLinks.map((link) => {
            const parts = getLinkTileParts(link);
            return (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                <span>{parts.label}</span>
                {parts.detail && <strong>{parts.detail}</strong>}
              </a>
            );
          })}
        </div>
      ) : (
        <p className={`${hobbyStyles.sourceEmpty} hobby-meta`}>{noTypingProfilesLabel}</p>
      )}
    </div>
  );
};
