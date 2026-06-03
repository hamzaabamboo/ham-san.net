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
  status = 'active'
}: HobbyEmbedProps) => {
  const profileLinks = links
    .filter((link) =>
      /(typingstats|keymash|monkeytype|typeracer|10fastfingers)/i.test(`${link.label} ${link.href}`)
    )
    .slice(0, 6);
  const visibleLinks = profileLinks.length > 0 ? profileLinks : links.slice(0, 6);
  const sourceRows = [
    ['profiles', String(visibleLinks.length)],
    ['updated', updatedAt ?? 'live'],
    ['status', status],
    ['source', body ? 'outline' : 'empty']
  ];

  return (
    <div className={hobbyStyles.sourceModule}>
      <div className={hobbyStyles.sourceStats}>
        {sourceRows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {visibleLinks.length > 0 ? (
        <div className={hobbyStyles.sourceLinks}>
          {visibleLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <strong>{getHostLabel(link.href)}</strong>
            </a>
          ))}
        </div>
      ) : (
        <p className={hobbyStyles.sourceEmpty}>No external typing profiles in the source note.</p>
      )}
    </div>
  );
};
