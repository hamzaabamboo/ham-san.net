import { useState } from 'react';
import { hobbyStyles } from '../hobbyStyles';

const chords = [
  { name: 'Cmaj7', notes: [261.63, 329.63, 392, 493.88] },
  { name: 'Dm9', notes: [293.66, 349.23, 440, 523.25] },
  { name: 'G13', notes: [196, 246.94, 329.63, 440] },
  { name: 'Am7', notes: [220, 261.63, 329.63, 392] }
];

const pianoKeys = [
  false,
  true,
  false,
  true,
  false,
  false,
  true,
  false,
  true,
  false,
  true,
  false,
  false,
  true
];

export const PianoChordsEmbed = () => {
  const [playedChord, setPlayedChord] = useState<string | null>(null);

  const playChord = (name: string, notes: number[]) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setPlayedChord('audio unavailable');
      return;
    }

    const audio = new AudioContextClass();
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, audio.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 1.2);
    gain.connect(audio.destination);

    notes.forEach((frequency, index) => {
      const osc = audio.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, audio.currentTime + index * 0.025);
      osc.connect(gain);
      osc.start(audio.currentTime + index * 0.025);
      osc.stop(audio.currentTime + 1.25);
    });

    setPlayedChord(name);
  };

  return (
    <div>
      <div className={hobbyStyles.pianoKeys} aria-hidden="true">
        {pianoKeys.map((isBlack, index) => (
          <span key={index} data-black={isBlack} />
        ))}
      </div>
      <div className={hobbyStyles.pianoControls}>
        {chords.map((chord) => (
          <button key={chord.name} type="button" onClick={() => playChord(chord.name, chord.notes)}>
            {chord.name}
          </button>
        ))}
      </div>
      <p className={hobbyStyles.pianoStatus}>
        {playedChord ? `Played ${playedChord}` : 'Audio starts after a tap.'}
      </p>
    </div>
  );
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
