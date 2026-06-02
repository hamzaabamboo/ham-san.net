import { hobbyStyles } from '../hobbyStyles';

const typingStats = [
  ['content', 'practice logs'],
  ['profiles', 'external links'],
  ['layout', 'jp / en'],
  ['source', 'markdown']
];

export const TypingStatsEmbed = () => (
  <div className={hobbyStyles.stats}>
    {typingStats.map(([label, value]) => (
      <div key={label}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    ))}
  </div>
);
