import { cleanSourceText, getListItems, getMarkdownSection } from './hobby-source';

export type HobbyChord = {
  name: string;
  notes?: number[];
};

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

export const getHobbyChordItems = (body: string): HobbyChord[] => {
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
      } satisfies HobbyChord;
    })
    .filter((chord) => chord.name);
};

export const hasPlayableChords = (body: string) =>
  getHobbyChordItems(body).some((chord) => chord.notes);
