import { useState } from 'react';
import { hobbyStyles } from '../hobbyStyles';
import { cleanSourceText, getListItems, getMarkdownSection } from './source';
import type { HobbyEmbedProps } from './types';

type ChordSource = {
  name: string;
  notes?: number[];
  href?: string;
};

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

const noteOffsets: Record<string, number> = {
  c: -9,
  'c#': -8,
  db: -8,
  d: -7,
  'd#': -6,
  eb: -6,
  e: -5,
  f: -4,
  'f#': -3,
  gb: -3,
  g: -2,
  'g#': -1,
  ab: -1,
  a: 0,
  'a#': 1,
  bb: 1,
  b: 2
};

const getFrequency = (token: string) => {
  const match = token
    .trim()
    .toLowerCase()
    .match(/^([a-g](?:#|b)?)(\d)?$/);
  if (!match) return undefined;

  const offset = noteOffsets[match[1]];
  if (offset === undefined) return undefined;

  const octave = Number(match[2] ?? '4');
  const semitones = offset + (octave - 4) * 12;
  return 440 * 2 ** (semitones / 12);
};

const parseNotes = (value: string) =>
  value
    .split(/[\s,]+/)
    .map((token) => Number(token) || getFrequency(token))
    .filter((note): note is number => !!note && Number.isFinite(note));

const getChordItems = (body: string) => {
  const section = ['Chords', 'Voicings', 'Audio']
    .map((heading) => getMarkdownSection(body, heading))
    .find(Boolean);

  return getListItems(section ?? '')
    .map((item) => {
      const [name, ...noteParts] = item.split(':');
      const notes = parseNotes(noteParts.join(':'));

      return {
        name: cleanSourceText(name ?? item),
        notes: notes.length > 0 ? notes : undefined
      } satisfies ChordSource;
    })
    .filter((chord) => chord.name);
};

export const PianoChordsEmbed = ({
  body = '',
  nestedPages = [],
  audioUnavailableLabel = 'audio unavailable',
  playedLabel = 'Played',
  audioStartsAfterTapLabel = 'Audio starts after a tap.',
  sourcePagesAttachedLabel = 'Source pages attached. Add Chords, Voicings, or Audio lists for playback.'
}: HobbyEmbedProps) => {
  const [playedChord, setPlayedChord] = useState<string | null>(null);
  const chordItems = getChordItems(body);
  const sourceItems: ChordSource[] =
    chordItems.length > 0
      ? chordItems
      : nestedPages.map((page) => ({
          name: page.title,
          href: page.href
        }));

  const playChord = (name: string, notes: number[]) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setPlayedChord(audioUnavailableLabel);
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
        {sourceItems.map((item) =>
          item.notes ? (
            <button key={item.name} type="button" onClick={() => playChord(item.name, item.notes!)}>
              {item.name}
            </button>
          ) : (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          )
        )}
      </div>
      <p className={hobbyStyles.pianoStatus}>
        {playedChord
          ? `${playedLabel} ${playedChord}`
          : chordItems.length > 0
            ? audioStartsAfterTapLabel
            : sourcePagesAttachedLabel}
      </p>
    </div>
  );
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
