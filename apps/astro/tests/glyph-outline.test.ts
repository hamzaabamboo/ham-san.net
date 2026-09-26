import { describe, expect, test } from 'bun:test';
import * as md from 'react-icons/md';

// `MdOutlineX` is not always a different drawing from `MdX` — Material ships no outlined cut
// for some names, and react-icons re-exports the filled one under the Outline alias. So the
// round-19/20 guards, which check the identifier prefix, pass while a solid mass renders
// among hairline strokes. This compares the actual path data.
const RENDERS_IDENTICAL_BY_DESIGN = new Set([
  // Line-art glyphs with no fill to remove: the outline and solid cuts are the same drawing
  // and both read correctly beside stroked neighbours.
  'MdOutlineNorthEast',
  'MdOutlineTimeline'
]);

const draw = (name: string) => {
  const Component = (md as Record<string, unknown>)[name] as
    | ((props: object) => unknown)
    | undefined;
  return Component ? JSON.stringify(Component({})) : undefined;
};

describe('outlined icons are actually outlined', () => {
  test('no mapped MdOutline* icon is byte-identical to its solid twin', async () => {
    // Comments stripped first: an identifier named in an explanatory comment is not a use.
    const files = [
      'apps/astro/src/components/ui/glyph.tsx',
      // Sidebar maps nine icons directly, for tree-shaking — they are "mapped" too.
      'apps/astro/src/components/layout/Sidebar.tsx'
    ];
    const source = (await Promise.all(files.map((f) => Bun.file(f).text())))
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
    const used = [...source.matchAll(/\b(MdOutline[A-Za-z]+)\b/g)].map((m) => m[1]);
    expect(new Set(used).size).toBeGreaterThan(15);

    const solidLookalikes: string[] = [];
    for (const name of new Set(used)) {
      if (RENDERS_IDENTICAL_BY_DESIGN.has(name)) continue;
      const outline = draw(name);
      const solid = draw(name.replace('MdOutline', 'Md'));
      expect(outline).toBeDefined();
      if (solid !== undefined && outline === solid) solidLookalikes.push(name);
    }
    expect(solidLookalikes).toEqual([]);
  });
});
