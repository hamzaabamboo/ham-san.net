import { describe, expect, test } from 'bun:test';
import { authoredHeadingLevels, makeRankOf } from '../src/utils/heading-rank';

const rank = (content: string) => makeRankOf(authoredHeadingLevels(content));

describe('authored heading levels', () => {
  test('ranks on the sequence present, not the absolute depth', () => {
    // The defect: a document starting at `####` mapped to `min(6, 4 + offset)`, producing
    // an h2 -> h6 jump on /tags/<slug> with no h3, h4 or h5 between.
    const of = rank('#### Deep\n\n##### Deeper\n\n###### Deepest');
    expect([of(4), of(5), of(6)]).toEqual([1, 2, 3]);
  });

  test('a contiguous document is unchanged', () => {
    const of = rank('# A\n\n## B\n\n### C');
    expect([of(1), of(2), of(3)]).toEqual([1, 2, 3]);
  });

  test('non-contiguous levels close up', () => {
    const of = rank('# A\n\n### C\n\n###### F');
    expect([of(1), of(3), of(6)]).toEqual([1, 2, 3]);
  });

  test('a single level is always rank 1', () => {
    const of = rank('### Only\n\n### Also');
    expect(of(3)).toBe(1);
  });

  test('a document with no headings ranks everything at 1', () => {
    const of = rank('Just a paragraph.\n\nAnd another.');
    expect(authoredHeadingLevels('Just a paragraph.')).toEqual([]);
    expect(of(1)).toBe(1);
  });

  test('headings inside fenced code are not authored headings', () => {
    // Both fence styles: a `~~~` block was previously scanned as real content, so a
    // commented `# fake` inside one silently shifted every real heading down a rank.
    for (const fence of ['```', '~~~']) {
      const of = rank(`${fence}\n# fake\n${fence}\n\n## A\n\n### B`);
      expect(authoredHeadingLevels(`${fence}\n# fake\n${fence}\n\n## A`)).toEqual([2]);
      expect([of(2), of(3)]).toEqual([1, 2]);
    }
  });

  test('up to three leading spaces still makes a heading', () => {
    // CommonMark allows it, and missing it ranked the SHALLOWER level DEEPER than the
    // deeper one.
    const of = rank('   ## A\n\n### B');
    expect(authoredHeadingLevels('   ## A\n\n### B')).toEqual([2, 3]);
    expect([of(2), of(3)]).toEqual([1, 2]);
  });

  test('four leading spaces is an indented code block, not a heading', () => {
    expect(authoredHeadingLevels('    # not a heading\n\n## A')).toEqual([2]);
  });

  test('an unterminated fence runs to EOF, so nothing after it is a heading', () => {
    // CommonMark: an unclosed fence swallows the rest of the document. Counting the text
    // inside it injected a phantom level and shifted every real heading down a rank.
    expect(authoredHeadingLevels('```\n# fake\n### A\n\n#### C')).toEqual([]);
  });

  test('an indented fence is still a fence', () => {
    // Up to three leading spaces is legal, and the old anchor missed it entirely.
    expect(authoredHeadingLevels('  ```\n# fake\n  ```\n\n### A\n\n#### C')).toEqual([3, 4]);
  });

  test('headings inside an html comment do not count', () => {
    expect(authoredHeadingLevels('<!--\n# fake\n-->\n\n### A\n\n#### C')).toEqual([3, 4]);
  });

  test('a thematic break is not a setext underline', () => {
    // `---` after a list, a heading or a blockquote renders as <hr>, not an h2.
    expect(authoredHeadingLevels('- a\n- b\n---\n\n### A\n\n#### C')).toEqual([3, 4]);
    expect(authoredHeadingLevels('### A\n---\n\n#### C')).toEqual([3, 4]);
    expect(authoredHeadingLevels('> quoted\n---\n\n### A\n\n#### C')).toEqual([3, 4]);
  });

  test('yaml frontmatter is not a setext heading', () => {
    expect(authoredHeadingLevels('---\ntitle: T\n---\n\n### A\n\n#### C')).toEqual([3, 4]);
  });

  test('setext headings count', () => {
    expect(authoredHeadingLevels('Title\n=====\n\n## A')).toEqual([1, 2]);
    expect(authoredHeadingLevels('Title\n-----\n\n### A')).toEqual([2, 3]);
  });

  test('a level absent from the scan never falls back to its own depth', () => {
    // Falling through to `level` reintroduces the absolute mapping: an h1 rendered by the
    // parser but invisible to the scanner must not outrank the levels that were seen.
    const of = rank('## A\n\n### B');
    expect(of(1)).toBe(1);
    expect(of(6)).toBe(3);
    expect(of(1)).toBeLessThanOrEqual(of(2));
  });
});
