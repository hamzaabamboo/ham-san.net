import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

export const FieldNotesEmbed = ({
  body = '',
  links = [],
  updatedAt,
  status = 'active'
}: HobbyEmbedProps) => (
  <div className={hobbyStyles.fieldNotes}>
    <span className={hobbyStyles.fallbackMark}>NT</span>
    <div>
      <p>{body ? 'Source note attached' : 'No source note yet'}</p>
      <span>
        {status} / {links.length} links / {updatedAt ?? 'live'}
      </span>
    </div>
  </div>
);
