import { describe, expect, test } from 'bun:test';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { authoredHeadingLevels, FRONTMATTER } from '../src/utils/heading-rank';

// A hand-written suite only covers the shapes someone thought of, and this scanner has now
// been wrong six ways that nobody thought of. Compare it against the parser family
// react-markdown actually uses: whatever that reports as a heading is the ground truth.
const rendered = (markdown: string): number[] => {
  const tree = fromMarkdown(markdown.replace(FRONTMATTER, ''), {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });
  const depths = new Set<number>();
  const walk = (node: { type?: string; depth?: number; children?: unknown[] }) => {
    if (node.type === 'heading' && typeof node.depth === 'number') depths.add(node.depth);
    for (const child of (node.children ?? []) as (typeof node)[]) walk(child);
  };
  walk(tree as never);
  return [...depths].sort((a, b) => a - b);
};

const CORPUS: [string, string][] = [
  ['contiguous', '# A\n\n## B\n\n### C'],
  ['deep only', '#### D\n\n##### E'],
  ['non-contiguous', '# A\n\n### C\n\n###### F'],
  ['no headings', 'Just a paragraph.\n\nAnd another.'],
  ['backtick fence', '```\n# fake\n```\n\n## A\n\n### B'],
  ['tilde fence', '~~~\n# fake\n~~~\n\n## A\n\n### B'],
  ['unterminated fence', '```\n# fake\n### A\n\n#### C'],
  ['indented fence', '  ```\n# fake\n  ```\n\n### A\n\n#### C'],
  ['long fence closed short', '````\n# fake1\n```\n# fake2\n````\n\n### A'],
  ['html comment', '<!--\n# fake\n-->\n\n### A\n\n#### C'],
  [
    'comment across fences',
    '```js\nconst a = "<!--";\n```\n\n# One\n\n```js\nconst b = "-->";\n```\n\n## Two'
  ],
  ['html block', '<div>\n# inside html block\n</div>\n\n### A'],
  ['thematic break after list', '- a\n- b\n---\n\n### A\n\n#### C'],
  ['break after heading', '### A\n---\n\n#### C'],
  ['break after quote', '> quoted\n---\n\n### A\n\n#### C'],
  ['frontmatter', '---\ntitle: T\n---\n\n### A\n\n#### C'],
  ['setext h1', 'Title\n=====\n\n## A'],
  ['setext h2', 'Title\n-----\n\n### A'],
  ['setext single dash', 'Title\n-\n\n### A'],
  ['blockquoted heading', '> # Quoted heading\n\n### A'],
  ['indented heading', '   ## A\n\n### B'],
  ['indented code block', '    # not a heading\n\n## A'],
  ['crlf', '### A\r\n\r\n#### C'],
  ['heading no space', '#Nospace\n\n## A'],
  // Six shapes the hand-written suite did not think of, found by widening this corpus.
  ['heading in list item', '- # H\n\n### A'],
  ['setext after link-ref def', '[a]: http://x\n---\n\n### A'],
  ['break after gfm table', '| a |\n| - |\n| b |\n---\n\n### A'],
  ['fence inside list item', '- ```\n  # fake\n  ```\n\n### A'],
  ['comment then atx on one line', '<!-- c --># A\n\n### B'],
  ['fence inside blockquote', '> ```\n> # fake\n> ```\n\n### A'],
  // An unclosed fence inside a blockquote ends with the blockquote. Treating it as running
  // to EOF erased every heading in the document.
  ['unclosed fence in blockquote', '> ```js\n> const a = 1;\n\n## One\n\n### Sub\n\n## Two'],
  ['unclosed fence in blockquote, no sub', '> ```js\n> code\n\n## A'],
  ['setext after lazy list continuation', '- item\nSetext\n-----\n\n### A']
];

describe('scanner agrees with the markdown parser', () => {
  for (const [name, markdown] of CORPUS) {
    test(name, () => {
      expect({ [name]: authoredHeadingLevels(markdown) }).toEqual({ [name]: rendered(markdown) });
    });
  }
});

// A hand-written corpus has now missed nine shapes across three rounds. This generates
// every three-block permutation of the block types CMS markdown actually contains and
// asserts the scanner matches the parser on all of them — which is how the last two
// fence-precedence bugs were found.
describe('scanner matches the parser across generated documents', () => {
  const BLOCKS = [
    '# H1',
    '## H2',
    '### H3',
    '#### H4',
    'Para text',
    'Title\n=====',
    'Title\n-----',
    '```\ncode\n```',
    '```js\ncode',
    '~~~\ncode\n~~~',
    '> quote',
    '> # QH',
    '> ```\n> c\n> ```',
    '> ```js\n> c',
    '- item',
    '- # LH',
    '- ```\n  c\n  ```',
    '---',
    '<!-- c -->',
    '<!--\nc\n-->',
    '<div>\nx\n</div>',
    '| a |\n| - |',
    '[r]: http://x',
    '    indented',
    '#NoSpace',
    // Shapes the 25-type set could not produce, each of which hid a real disagreement:
    '- item\n\n    # Deep',
    '- a\n  - b\n    - c',
    '>> deep quote',
    '<!-- c --># A',
    // Every comment block above is self-contained, so the correct path and the blank-line
    // fallback always agreed and the `<!--` branch could be deleted with the suite green.
    '<!--\ndraft\n\n## hidden\n-->',
    // Only a CommonMark type-6 tag interrupts a paragraph; `<div>` is one, so it agreed by
    // luck. `<br>`/`<span>` are type 7 and swallowed every heading that followed.
    '<br>',
    '<span>x</span>',
    // No entry contained a tab, so indentation counted in spaces alone always agreed.
    '\t# tabbed',
    '- item\n\n\t# Deep'
  ];

  // Six combinations still diverge. Every one needs a list PLUS a table, blockquote or bare
  // tag PLUS a TAB-indented ATX heading in one document — a shape that does not occur in CMS
  // prose. They are listed rather than tolerated silently: the assertion is set equality, so
  // a NEW divergence fails even though these are accepted.
  const KNOWN_DIVERGENCES = [
    '> quote\n<br>\n> # QH',
    '- item\n\n| a |\n| - |\n\n\t# tabbed',
    '- ```\n  c\n  ```\n\n| a |\n| - |\n\n\t# tabbed',
    '- ```\n  c\n  ```\n| a |\n| - |\n\t# tabbed',
    '- a\n  - b\n    - c\n\n| a |\n| - |\n\n\t# tabbed',
    '- a\n  - b\n    - c\n<br>\n\t# tabbed'
  ];

  test('every three-block permutation agrees', () => {
    const mismatches = new Set<string>();
    let checked = 0;
    for (const a of BLOCKS) {
      for (const b of BLOCKS) {
        for (const c of BLOCKS) {
          // Both joins over 34 blocks is ~78k documents: `\n\n` can never place a block
          // boundary inside a construct that only a blank line terminates, so a single
          // newline is a distinct shape and found nine real bugs inspection missed.
          for (const doc of [`${a}\n\n${b}\n\n${c}`, `${a}\n${b}\n${c}`]) {
            checked++;
            if (JSON.stringify(authoredHeadingLevels(doc)) !== JSON.stringify(rendered(doc))) {
              mismatches.add(doc);
            }
          }
        }
      }
    }
    // A floor plus membership, not `BLOCKS.length ** 3` — that is guaranteed by the loop
    // itself and so cannot fail for the reason it names.
    expect(BLOCKS.length).toBeGreaterThanOrEqual(34);
    expect(checked).toBeGreaterThan(78000);
    for (const required of [
      '```js\ncode',
      '> ```js\n> c',
      '- item\n\n    # Deep',
      '    indented',
      '<!--\ndraft\n\n## hidden\n-->',
      '<br>',
      '\t# tabbed'
    ]) {
      expect(BLOCKS).toContain(required);
    }
    expect([...mismatches].sort()).toEqual([...KNOWN_DIVERGENCES].sort());
  }, 60000);
});
