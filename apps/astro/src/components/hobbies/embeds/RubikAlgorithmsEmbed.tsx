import { useState } from 'react';
import { hobbyStyles } from '../hobbyStyles';
import { cleanSourceText, getHostLabel, getListItems, getMarkdownSection } from './source';
import type { HobbyEmbedProps } from './types';

type AlgorithmSet = {
  name: string;
  notation: string;
  use: string;
  href?: string;
};

const parseSourceAlgorithms = (body: string): AlgorithmSet[] =>
  getListItems(getMarkdownSection(body, 'Algorithms'))
    .map((item) => {
      const [name, ...notationParts] = item.split(':');
      const notation = cleanSourceText(notationParts.join(':'));

      return {
        name: cleanSourceText(name ?? item),
        notation: notation || cleanSourceText(item),
        use: 'source note'
      } satisfies AlgorithmSet;
    })
    .filter((algorithm) => algorithm.name && algorithm.notation);

export const RubikAlgorithmsEmbed = ({
  body = '',
  links = [],
  nestedPages = []
}: HobbyEmbedProps) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(0);
  const sourceAlgorithms = parseSourceAlgorithms(body);
  const resources = links
    .filter((link) =>
      /(cube|cubing|oll|pll|alg|speedcube|jperm|cstimer|cubeskills|bestsiteever)/i.test(
        `${link.label} ${link.href}`
      )
    )
    .slice(0, 6);
  const sourceSets: AlgorithmSet[] =
    sourceAlgorithms.length > 0
      ? sourceAlgorithms
      : nestedPages.map((page) => ({
          name: page.title,
          notation: page.title,
          use: 'nested source page',
          href: page.href
        }));
  const activeSet = sourceSets[activeAlgorithm] ?? sourceSets[0];

  return (
    <div className={hobbyStyles.algorithmShell}>
      {sourceSets.length > 0 ? (
        <div className={hobbyStyles.algorithm}>
          <div className={hobbyStyles.algorithmTabs}>
            {sourceSets.map((algorithm, index) => (
              <button
                key={algorithm.name}
                type="button"
                data-active={index === activeAlgorithm}
                onClick={() => setActiveAlgorithm(index)}
              >
                {algorithm.name}
              </button>
            ))}
          </div>
          <div className={hobbyStyles.algorithmViewer}>
            <p>{activeSet?.notation}</p>
            <span>{activeSet?.use}</span>
            {activeSet?.href && <a href={activeSet.href}>Open source page</a>}
          </div>
        </div>
      ) : (
        <p className={hobbyStyles.sourceEmpty}>No algorithm sets in the source note.</p>
      )}
      {resources.length > 0 && (
        <div className={hobbyStyles.algorithmResources}>
          {resources.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <strong>{getHostLabel(link.href)}</strong>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
