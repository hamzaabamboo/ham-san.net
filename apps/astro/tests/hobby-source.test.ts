import { describe, expect, test } from 'bun:test';
import {
  cleanSourceText,
  getHostLabel,
  getLinkTileParts,
  getMarkdownSection,
  getPathLabel
} from '../src/utils/hobby-source';

describe('hobby source utils', () => {
  test('getHostLabel strips www and falls back to the raw value on invalid URLs', () => {
    expect(getHostLabel('https://www.lenstip.com/reviews')).toBe('lenstip.com');
    expect(getHostLabel('not a url')).toBe('not a url');
  });

  test('getPathLabel returns the path, the host for bare roots, and the raw value on invalid URLs', () => {
    expect(getPathLabel('https://10fastfingers.com/user/3914004/')).toBe('/user/3914004');
    expect(getPathLabel('https://monkeytype.com/')).toBe('monkeytype.com');
    expect(getPathLabel('not a url')).toBe('not a url');
  });

  test('getLinkTileParts keeps distinct labels with the host as detail', () => {
    expect(getLinkTileParts({ href: 'https://jperm.net/algs', label: 'OLL sheet' })).toEqual({
      label: 'OLL sheet',
      detail: 'jperm.net'
    });
  });

  test('getLinkTileParts derives a path detail when the label just mirrors the host', () => {
    expect(getLinkTileParts({ href: 'https://jperm.net/algs', label: 'jperm.net' })).toEqual({
      label: 'jperm.net',
      detail: '/algs'
    });
  });

  test('getLinkTileParts suppresses the detail when the path equals the host', () => {
    expect(getLinkTileParts({ href: 'https://jperm.net/', label: 'jperm.net' })).toEqual({
      label: 'jperm.net',
      detail: undefined
    });
  });

  test('cleanSourceText unescapes artifacts and strips markdown links and emphasis', () => {
    expect(cleanSourceText('\\~60s *fast* `runs`')).toBe('~60s fast runs');
    expect(cleanSourceText('See [J Perm](https://jperm.net)   videos')).toBe('See J Perm videos');
  });

  test('getMarkdownSection returns content between heading boundaries only', () => {
    const body = `# Algorithms
- T perm: R U R' U'

# Links
- https://jperm.net`;

    expect(getMarkdownSection(body, 'Algorithms')).toBe("- T perm: R U R' U'");
    expect(getMarkdownSection(body, 'Links')).toBe('- https://jperm.net');
    expect(getMarkdownSection(body, 'Missing')).toBe('');
  });
});
