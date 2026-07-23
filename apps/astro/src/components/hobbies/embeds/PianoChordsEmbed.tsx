import { useRef, useState } from 'react';
import { getHobbyChordItems } from '~/utils/hobby-chords';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

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

export const PianoChordsEmbed = ({
  body = '',
  audioUnavailableLabel = 'audio unavailable',
  playedLabel = 'Played',
  audioStartsAfterTapLabel = 'Audio starts after a tap.',
  noChordsLabel = 'No chords are listed yet.'
}: HobbyEmbedProps) => {
  const [playedChord, setPlayedChord] = useState<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const chordItems = getHobbyChordItems(body).filter((chord) => chord.notes);

  const playChord = (name: string, notes: number[]) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setPlayedChord(audioUnavailableLabel);
      return;
    }

    const audio = audioRef.current ?? (audioRef.current = new AudioContextClass());
    if (audio.state === 'suspended') void audio.resume();

    const now = audio.currentTime;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    gain.connect(audio.destination);

    notes.forEach((frequency, index) => {
      const osc = audio.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now + index * 0.025);
      osc.connect(gain);
      osc.start(now + index * 0.025);
      osc.stop(now + 1.25);
    });

    setPlayedChord(name);
  };

  if (chordItems.length === 0) {
    return <p className={hobbyStyles.sourceEmpty}>{noChordsLabel}</p>;
  }

  return (
    <div>
      <div className={hobbyStyles.pianoKeys} aria-hidden="true">
        {pianoKeys.map((isBlack, index) => (
          <span key={index} data-black={isBlack} />
        ))}
      </div>
      <div className={hobbyStyles.pianoControls}>
        {chordItems.map((item) => (
          <button key={item.name} type="button" onClick={() => playChord(item.name, item.notes!)}>
            {item.name}
          </button>
        ))}
      </div>
      <p className={hobbyStyles.pianoStatus}>
        {playedChord ? `${playedLabel} ${playedChord}` : audioStartsAfterTapLabel}
      </p>
    </div>
  );
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
