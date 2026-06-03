import { useState } from 'react';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

const algorithms = [
  { name: 'Sexy move', notation: "R U R' U'", use: 'fingertrick warmup' },
  { name: 'Sune', notation: "R U R' U R U2 R'", use: 'OLL recognition' },
  { name: 'T perm', notation: "R U R' U' R' F R2 U' R' U' R U R' F'", use: 'PLL baseline' }
];

const getHostLabel = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
};

export const RubikAlgorithmsEmbed = ({ links = [] }: HobbyEmbedProps) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(0);
  const resources = links.slice(0, 4);

  return (
    <div className={hobbyStyles.algorithmShell}>
      <div className={hobbyStyles.algorithm}>
        <div className={hobbyStyles.algorithmTabs}>
          {algorithms.map((algorithm, index) => (
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
          <p>{algorithms[activeAlgorithm].notation}</p>
          <span>{algorithms[activeAlgorithm].use}</span>
        </div>
      </div>
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
