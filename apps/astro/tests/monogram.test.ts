import { describe, expect, test } from 'bun:test';
import { projectMonogram } from '../src/utils/monogram';

describe('projectMonogram', () => {
  test('uses the initials of the first two words', () => {
    expect(projectMonogram('LoveLive! Sorter')).toBe('LS');
    expect(projectMonogram('Link! Like! LoveLive! Chart Viewer')).toBe('LL');
  });

  test('distinguishes projects that share a first letter', () => {
    expect(projectMonogram('LoveLive! Sorter')).not.toBe(
      projectMonogram('Link! Like! LoveLive! Chart Viewer')
    );
  });

  test('falls back to a single letter for one-word titles', () => {
    expect(projectMonogram('Pixelator')).toBe('P');
  });

  test('ignores punctuation and separators', () => {
    expect(projectMonogram('ham-san.net')).toBe('HS');
  });

  test('handles non-latin titles', () => {
    expect(projectMonogram('ぼっちラブカシミュレーター (Bocchi Loveca Simulator)')).toBe('ぼB');
  });

  test('falls back to P for empty titles', () => {
    expect(projectMonogram('')).toBe('P');
    expect(projectMonogram(null)).toBe('P');
    expect(projectMonogram(undefined)).toBe('P');
  });
});
