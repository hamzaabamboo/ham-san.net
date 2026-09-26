import { describe, expect, test } from 'bun:test';
import { isStructuralLine } from '../src/components/lib/Markdown';

describe('chord and tab lines are not prose', () => {
  test('a bar-delimited row and a section label are structural', () => {
    // Both arrive from Outline as ordinary paragraphs, so they were set in Manrope at a 52px
    // pitch: the bar columns did not line up and a two-screen chart ran to five.
    expect(isStructuralLine('| Db | Ab/C | Bbm | Ab |')).toBe(true);
    expect(isStructuralLine('| E | F#m/A | B | E E/Db')).toBe(true);
    expect(isStructuralLine('[Intro]')).toBe(true);
    expect(isStructuralLine('  [A2]  ')).toBe(true);
  });

  test('prose is never captured', () => {
    // The rule has to be unreachable from ordinary writing, including writing that happens
    // to contain a pipe or a bracket.
    expect(isStructuralLine('Key: E')).toBe(false);
    expect(isStructuralLine('I spend as much time in a darkroom as I do in VS Code.')).toBe(false);
    expect(isStructuralLine('See [the docs](https://example.com) for details.')).toBe(false);
    expect(isStructuralLine('Use grep | head to page the output.')).toBe(false);
    expect(isStructuralLine('推し活の記録をここにまとめています。')).toBe(false);
    expect(isStructuralLine('')).toBe(false);
  });

  test('a multi-line paragraph stays prose', () => {
    // Only a single line qualifies: a soft-wrapped paragraph that opens with a pipe is still
    // a paragraph.
    expect(isStructuralLine('| E | F#m |\nand then the chorus repeats twice.')).toBe(false);
  });
});

describe('a run of structural lines reads as one block', () => {
  test('consecutive lines close up the stack gap', async () => {
    const css = await Bun.file('apps/astro/src/index.css').text();
    expect(css).toMatch(/\.markdown-structural \+ \.markdown-structural \{\s*margin-top: -1rem;/);
  });
});
