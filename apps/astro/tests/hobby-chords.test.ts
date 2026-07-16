import { describe, expect, test } from 'bun:test';
import { getHobbyChordItems, hasPlayableChords } from '../src/utils/hobby-chords';

const body = (items: string[]) => `# Chords\n\n${items.map((item) => `- ${item}`).join('\n')}`;

describe('hobby chords', () => {
  test('parses a4 as concert pitch 440', () => {
    const [chord] = getHobbyChordItems(body(['A: a4']));
    expect(chord?.name).toBe('A');
    expect(chord?.notes?.[0]).toBeCloseTo(440);
  });

  test('computes c4 relative to a440', () => {
    const [chord] = getHobbyChordItems(body(['C: c4']));
    expect(chord?.notes?.[0]).toBeCloseTo(261.63, 1);
  });

  test('treats sharps and flats as enharmonic equivalents', () => {
    const [sharp] = getHobbyChordItems(body(['Sharp: a#4']));
    const [flat] = getHobbyChordItems(body(['Flat: bb4']));
    expect(sharp?.notes?.[0]).toBeDefined();
    expect(sharp?.notes?.[0]).toBeCloseTo(flat?.notes?.[0] ?? 0, 6);
  });

  test('passes numeric tokens through unchanged', () => {
    const [chord] = getHobbyChordItems(body(['Raw: 523.25 660']));
    expect(chord?.notes).toEqual([523.25, 660]);
  });

  test('drops invalid tokens and keeps valid ones', () => {
    const [chord] = getHobbyChordItems(body(['Mixed: h4 xyz a4']));
    expect(chord?.notes).toEqual([440]);
  });

  test('reports no playable chords when every token is invalid', () => {
    expect(hasPlayableChords(body(['Broken: zz q9']))).toBe(false);
    expect(hasPlayableChords(body(['Works: a4']))).toBe(true);
  });
});
