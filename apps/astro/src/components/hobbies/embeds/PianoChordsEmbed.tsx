import { useRef, useState } from 'react';
import { getHobbyChordItems } from '~/utils/hobby-chords';
import { hobbyStyles } from '../hobbyStyles';
import type { HobbyEmbedProps } from './types';

const whiteKeySemitones = [0, 2, 4, 5, 7, 9, 11];
const blackKeyAfter = new Set([0, 1, 3, 4, 5]);
const keyCount = 14;
const middleC = 261.6256;

const pianoKeys = Array.from({ length: keyCount }, (_, index) => {
  const octave = Math.floor(index / 7);
  const step = index % 7;
  const semitone = octave * 12 + whiteKeySemitones[step];
  const hasBlack = blackKeyAfter.has(step) && index < keyCount - 1;
  return { semitone, blackSemitone: hasBlack ? semitone + 1 : undefined };
});

const getChordSemitones = (notes: number[]) =>
  new Set(
    notes.map((frequency) => {
      const semitone = Math.round(12 * Math.log2(frequency / middleC));
      return semitone >= 0 && semitone < 24 ? semitone : ((semitone % 12) + 12) % 12;
    })
  );

type PlayedChord = { name: string; semitones: Set<number> };

export const PianoChordsEmbed = ({
  body = '',
  audioUnavailableLabel = 'audio unavailable',
  playedLabel = 'Played',
  audioStartsAfterTapLabel = 'Audio starts after a tap.',
  noChordsLabel = 'No chords are listed yet.'
}: HobbyEmbedProps) => {
  const [playedChord, setPlayedChord] = useState<PlayedChord | null>(null);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const chordItems = getHobbyChordItems(body).filter((chord) => chord.notes);

  const playChord = (name: string, notes: number[]) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setAudioFailed(true);
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

    setAudioFailed(false);
    setPlayedChord({ name, semitones: getChordSemitones(notes) });
  };

  if (chordItems.length === 0) {
    return <p className={hobbyStyles.sourceEmpty}>{noChordsLabel}</p>;
  }

  return (
    <div>
      <div className={hobbyStyles.pianoKeys} aria-hidden="true">
        {pianoKeys.map((key) => (
          <span key={key.semitone} data-active={!!playedChord?.semitones.has(key.semitone)}>
            {key.blackSemitone !== undefined && (
              <i data-active={!!playedChord?.semitones.has(key.blackSemitone)} />
            )}
          </span>
        ))}
      </div>
      <div className={hobbyStyles.pianoControls}>
        {chordItems.map((item) => (
          <button
            key={item.name}
            type="button"
            data-active={playedChord?.name === item.name}
            aria-pressed={playedChord?.name === item.name}
            onClick={() => playChord(item.name, item.notes!)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className={hobbyStyles.pianoStatus} aria-live="polite">
        {audioFailed
          ? audioUnavailableLabel
          : playedChord
            ? `${playedLabel} ${playedChord.name}`
            : audioStartsAfterTapLabel}
      </p>
    </div>
  );
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
