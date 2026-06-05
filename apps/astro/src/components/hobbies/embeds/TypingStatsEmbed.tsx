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
  body = '',
  links = [],
  updatedAt,
  status = 'active',
  statusLabel,
  liveContentLabel = 'live',
  profilesMetricLabel = 'profiles',
  updatedMetricLabel = 'updated',
  statusMetricLabel = 'status',
  sourceMetricLabel = 'source',
  sourceNoteLabel = 'outline',
  emptySourceLabel = 'empty',
  noTypingProfilesLabel = 'No external typing profiles in the source note.'
}: HobbyEmbedProps) => {
  const profileLinks = links
    .filter((link) =>
      /(typingstats|keymash|monkeytype|typeracer|10fastfingers)/i.test(`${link.label} ${link.href}`)
    )
    .slice(0, 6);
  const visibleLinks = profileLinks.length > 0 ? profileLinks : links.slice(0, 6);
  const sourceRows = [
    [profilesMetricLabel, String(visibleLinks.length)],
    [updatedMetricLabel, updatedAt ?? liveContentLabel],
    [statusMetricLabel, statusLabel || status],
    [sourceMetricLabel, body ? sourceNoteLabel : emptySourceLabel]
  ];

  return (
    <div className={hobbyStyles.sourceModule}>
      <div className={`${hobbyStyles.sourceStats} hobby-meta`}>
        {sourceRows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
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
