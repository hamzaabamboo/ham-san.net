import { useState } from 'react';

const algorithms = [
  { name: 'Sexy move', notation: "R U R' U'", use: 'fingertrick warmup' },
  { name: 'Sune', notation: "R U R' U R U2 R'", use: 'OLL recognition' },
  { name: 'T perm', notation: "R U R' U' R' F R2 U' R' U' R U R' F'", use: 'PLL baseline' }
];

export const RubikAlgorithmsEmbed = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(0);

  return (
    <div className="hobby-algorithm">
      <div className="hobby-algorithm__tabs">
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
      <div className="hobby-algorithm__viewer">
        <p>{algorithms[activeAlgorithm].notation}</p>
        <span>{algorithms[activeAlgorithm].use}</span>
      </div>
    </div>
  );
};
