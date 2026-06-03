import { hobbyStyles } from '../hobbyStyles';
import { cleanSourceText, getListItems, getMarkdownSection } from './source';
import type { HobbyEmbedProps } from './types';

const parseStats = (body: string) =>
  getListItems(getMarkdownSection(body, 'Stats'))
    .map((item) => {
      const [label, ...valueParts] = item.split(':');
      return {
        label: label?.trim() ?? '',
        value: valueParts.join(':').trim()
      };
    })
    .filter((stat) => stat.label && stat.value);

const parseGearGroups = (body: string) => {
  const gear = getMarkdownSection(body, 'Gear');
  const groups: Array<{ label: string; items: string[] }> = [];
  let current: { label: string; items: string[] } | undefined;

  gear.split('\n').forEach((line) => {
    const text = cleanSourceText(line);
    if (!text) return;

    if (text.endsWith(':')) {
      current = { label: text.slice(0, -1), items: [] };
      groups.push(current);
      return;
    }

    if (line.trim().startsWith('*') && current) {
      current.items.push(text);
    }
  });

  return groups.filter((group) => group.items.length > 0);
};

export const DartsBoardEmbed = ({ body = '' }: HobbyEmbedProps) => {
  const stats = parseStats(body);
  const gearGroups = parseGearGroups(body);

  return (
    <div className={hobbyStyles.dartsBoard}>
      <div className={hobbyStyles.dartsTarget} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={hobbyStyles.dartsStats}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      {gearGroups.length > 0 && (
        <div className={hobbyStyles.dartsGear}>
          {gearGroups.map((group) => (
            <section key={group.label}>
              <span>{group.label}</span>
              {group.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
