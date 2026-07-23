import { useState } from 'react';
import { getRubikResourceLinks } from '~/utils/hobby-links';
import { hobbyStyles } from '../hobbyStyles';
import { cleanSourceText, getLinkTileParts, getListItems, getMarkdownSection } from './source';
import type { HobbyEmbedProps } from './types';

type AlgorithmSet = {
  name: string;
  notation: string;
  use: string;
};

const parseSourceAlgorithms = (body: string, sourceNoteUseLabel: string): AlgorithmSet[] =>
  getListItems(getMarkdownSection(body, 'Algorithms'))
    .map((item) => {
      const [name, ...notationParts] = item.split(':');
      const notation = cleanSourceText(notationParts.join(':'));

      return {
        name: cleanSourceText(name ?? item),
        notation: notation || cleanSourceText(item),
        use: sourceNoteUseLabel
      } satisfies AlgorithmSet;
    })
    .filter((algorithm) => algorithm.name && algorithm.notation);

export const RubikAlgorithmsEmbed = ({
  body = '',
  links = [],
  sourceNoteUseLabel = 'note',
  noAlgorithmSetsLabel = 'No algorithm sets are listed yet.'
}: HobbyEmbedProps) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(0);
  const sourceSets = parseSourceAlgorithms(body, sourceNoteUseLabel);
  const resources = getRubikResourceLinks(links);
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
                aria-pressed={index === activeAlgorithm}
                onClick={() => setActiveAlgorithm(index)}
              >
                {algorithm.name}
              </button>
            ))}
          </div>
          <div className={hobbyStyles.algorithmViewer}>
            <p>{activeSet?.notation}</p>
            <span>{activeSet?.use}</span>
          </div>
        </div>
      ) : resources.length === 0 ? (
        <p className={hobbyStyles.sourceEmpty}>{noAlgorithmSetsLabel}</p>
      ) : null}
      {resources.length > 0 && (
        <div className={hobbyStyles.algorithmResources}>
          {resources.map((link) => {
            const parts = getLinkTileParts(link);
            return (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                <span>{parts.label}</span>
                {parts.detail && <strong>{parts.detail}</strong>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
