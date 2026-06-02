const typingStats = [
  ['best burst', '126 wpm'],
  ['daily floor', '84 wpm'],
  ['accuracy', '97.8%'],
  ['layout', 'JP / EN']
];

export const TypingStatsEmbed = () => (
  <div className="hobby-stats">
    {typingStats.map(([label, value]) => (
      <div key={label}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    ))}
  </div>
);
