import { describe, expect, test } from 'bun:test';
import { projectMonogram } from '../src/utils/monogram';

describe('monogram stays in one script', () => {
  test('a mixed-script title does not produce a kana + Latin mashup', () => {
    // Rendered at 96px in a Latin display serif, "ぼB" reads as broken text, not a mark.
    expect(projectMonogram('ぼっちラブカシミュレーター (Bocchi Loveca Simulator)')).toBe('BL');
  });

  test('a Latin title still gives two initials', () => {
    expect(projectMonogram('Homepage V4')).toBe('HV');
    expect(projectMonogram('Kanji Phonetics Component Explorer')).toBe('KP');
  });

  test('a CJK-only title abbreviates within its own script', () => {
    expect(projectMonogram('推し活記録')).toBe('推し');
    expect(projectMonogram('日本語')).toBe('日本');
  });

  test('a trailing year does not become the mark', () => {
    // `\p{N}` in the Latin test made a bare digit count as a Latin run, so these resolved to
    // a lone numeral set at 96px in a display serif.
    expect(projectMonogram('推し活記録 2024')).toBe('推し');
    expect(projectMonogram('ライブ記録 2023年')).toBe('ライ');
    expect(projectMonogram('日本語 3')).toBe('日本');
  });

  test('an empty or symbol-only title falls back', () => {
    expect(projectMonogram('')).toBe('P');
    expect(projectMonogram(null)).toBe('P');
    expect(projectMonogram('!!!')).toBe('P');
  });
});
