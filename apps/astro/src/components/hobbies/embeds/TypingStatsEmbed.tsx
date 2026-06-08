import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

const getHostLabel = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
};

export const TypingStatsEmbed = ({
  links = [],
  noTypingProfilesLabel = 'No typing profiles are linked yet.'
}: HobbyEmbedProps) => {
  const profileLinks = links
    .filter((link) =>
      /(typingstats|keymash|monkeytype|typeracer|10fastfingers)/i.test(`${link.label} ${link.href}`)
    )
    .slice(0, 6);
  const visibleLinks = profileLinks.length > 0 ? profileLinks : links.slice(0, 6);

  return (
    <div className={hobbyStyles.sourceModule}>
      {visibleLinks.length > 0 ? (
        <div className={`${hobbyStyles.sourceLinks} hobby-meta`}>
          {visibleLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <strong>{getHostLabel(link.href)}</strong>
            </a>
          ))}
        </div>
      ) : (
        <p className={`${hobbyStyles.sourceEmpty} hobby-meta`}>{noTypingProfilesLabel}</p>
      )}
    </div>
  );
};
