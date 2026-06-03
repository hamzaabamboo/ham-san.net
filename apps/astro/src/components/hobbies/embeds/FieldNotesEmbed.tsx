import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const FieldNotesEmbed = ({
  title,
  body = '',
  links = [],
  updatedAt,
  status = 'active'
}: HobbyEmbedProps) => {
  const sourceState = body ? 'source note attached' : 'empty source note';
  const lineItems = [
    ['status', status],
    ['links', String(links.length)],
    ['updated', updatedAt ?? 'live'],
    ['source', body ? 'outline body' : 'no body']
  ];

  return (
    <div className={hobbyStyles.fieldNotes}>
      <span className={hobbyStyles.fallbackMark}>NT</span>
      <div>
        <p>{sourceState}</p>
        <strong>{title ?? 'Field notes'}</strong>
      </div>
      <dl>
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
