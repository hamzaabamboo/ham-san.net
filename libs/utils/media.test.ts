import { describe, expect, test } from 'bun:test';
import { resolveMedia } from './media';

const SERVER = 'https://api.ham-san.net';

// Shaped from a real record on this CMS: 2560x1440 original with the four derivatives
// Strapi writes. `size` is in KILOBYTES; `width`/`height` in pixels.
const upload = {
  url: '/uploads/x.png',
  width: 2560,
  height: 1440,
  size: 783.53,
  formats: {
    large: { url: '/uploads/large_x.png', width: 1000, height: 563, size: 791.8 },
    medium: { url: '/uploads/medium_x.png', width: 750, height: 422, size: 472.74 },
    small: { url: '/uploads/small_x.png', width: 500, height: 281, size: 231.75 },
    thumbnail: { url: '/uploads/thumbnail_x.png', width: 245, height: 138, size: 64.83 }
  }
};

describe('resolveMedia', () => {
  test('picks the smallest derivative that still covers the box', () => {
    // 400 * 1.5 = 600, so `small` (500) is too narrow and `medium` (750) is the answer.
    expect(resolveMedia(upload, 400, SERVER)?.src).toBe(`${SERVER}/uploads/medium_x.png`);
    expect(resolveMedia(upload, 200, SERVER)?.src).toBe(`${SERVER}/uploads/small_x.png`);
    expect(resolveMedia(upload, 100, SERVER)?.src).toBe(`${SERVER}/uploads/thumbnail_x.png`);
  });

  test('returns the intrinsic size of whatever it chose', () => {
    expect(resolveMedia(upload, 400, SERVER)).toEqual({
      src: `${SERVER}/uploads/medium_x.png`,
      width: 750,
      height: 422
    });
  });

  test('covers the density target whenever a lighter derivative reaches it', () => {
    // Tier 1. These targets all have a wide-enough derivative that beats the original on
    // bytes, so the density multiplier must actually be honoured.
    for (const target of [100, 200, 400]) {
      const chosen = resolveMedia(upload, target, SERVER)!;
      expect(chosen.width).toBeGreaterThanOrEqual(target * 1.5);
    }
  });

  test('still covers the css box when no derivative reaches the density target', () => {
    // Tier 2 — asserting `>= target * 1.5` here would contradict the implementation, which
    // deliberately prefers a box-covering derivative over a multi-megapixel original.
    for (const target of [560, 640]) {
      const chosen = resolveMedia(upload, target, SERVER)!;
      expect(chosen.width).toBeGreaterThanOrEqual(target);
      expect(chosen.width).toBeLessThan(target * 1.5);
    }
  });

  test('refuses a derivative heavier than the original', () => {
    // `large` (791.8 KB) exceeds the 783.53 KB original, so a box only `large` could serve
    // takes the original rather than more bytes than the untouched file.
    const onlyLarge = {
      ...upload,
      formats: { large: (upload.formats as Record<string, unknown>).large }
    };
    expect(resolveMedia(onlyLarge, 600, SERVER)?.src).toBe(`${SERVER}/uploads/x.png`);

    // The real case this came from: every derivative is heavier than a small original.
    const inflated = {
      url: '/uploads/a.png',
      width: 1200,
      size: 40.29,
      formats: { medium: { url: '/uploads/medium_a.png', width: 750, size: 41.05 } }
    };
    expect(resolveMedia(inflated, 400, SERVER)?.src).toBe(`${SERVER}/uploads/a.png`);
  });

  test('ranks on width, not on a comparator that mixes kilobytes with pixels', () => {
    // `medium` records no size. Sorting `size ?? width` puts it after `large` (228.81) and
    // ships the wider, heavier file.
    const partial = {
      url: '/uploads/x.png',
      width: 2560,
      size: 900,
      formats: {
        large: { url: '/uploads/large_x.png', width: 1000, size: 228.81 },
        medium: { url: '/uploads/medium_x.png', width: 750 }
      }
    };
    expect(resolveMedia(partial, 400, SERVER)?.src).toBe(`${SERVER}/uploads/medium_x.png`);
  });

  test('resolves each url independently of the original', () => {
    // Strapi records derivative urls relative even when the original is absolute; deciding
    // the prefix once from the original strips the host off every derivative.
    const absolute = {
      url: 'https://cdn.example/a.png',
      width: 2560,
      size: 900,
      formats: { medium: { url: '/uploads/medium_a.png', width: 750, size: 145 } }
    };
    expect(resolveMedia(absolute, 400, SERVER)?.src).toBe(`${SERVER}/uploads/medium_a.png`);

    const absoluteDerivative = {
      url: '/uploads/a.png',
      width: 2560,
      size: 900,
      formats: { medium: { url: 'https://cdn.example/medium_a.png', width: 750, size: 145 } }
    };
    expect(resolveMedia(absoluteDerivative, 400, SERVER)?.src).toBe(
      'https://cdn.example/medium_a.png'
    );
  });

  test('falls back to the original when formats are absent or unusable', () => {
    for (const formats of [null, undefined, {}, 'not json', '[]', 42, { bad: { width: 900 } }]) {
      const src = resolveMedia({ ...upload, formats }, 400, SERVER)?.src;
      expect(src).toBe(`${SERVER}/uploads/x.png`);
    }
  });

  test('accepts formats delivered as a JSON string', () => {
    const asString = { ...upload, formats: JSON.stringify(upload.formats) };
    expect(resolveMedia(asString, 400, SERVER)?.src).toBe(`${SERVER}/uploads/medium_x.png`);
  });

  test('returns undefined rather than an empty src', () => {
    // `src=""` resolves to the document URL, costing an extra HTML fetch per image.
    expect(resolveMedia(null, 400, SERVER)).toBeUndefined();
    expect(resolveMedia(undefined, 400, SERVER)).toBeUndefined();
    expect(resolveMedia({ url: '' }, 400, SERVER)).toBeUndefined();
  });

  test('falls back to a derivative that covers the css box when none covers the density', () => {
    // A 557px card needs 836px at 1.5x and the ladder tops out at 750 below `large`, which
    // is heavier than the original. Ranking on the density target alone therefore shipped
    // the 2560px original: a 66% payload increase over the 750px file that fits fine.
    expect(resolveMedia(upload, 560, SERVER)?.src).toBe(`${SERVER}/uploads/medium_x.png`);
    expect(resolveMedia(upload, 640, SERVER)?.src).toBe(`${SERVER}/uploads/medium_x.png`);
  });

  test('keeps the original when no derivative covers the box at all', () => {
    // The project detail image renders ~1110px wide; `large` (1000) does not reach it, so
    // the original is the only correct answer and must not be downgraded.
    expect(resolveMedia(upload, 1110, SERVER)?.src).toBe(`${SERVER}/uploads/x.png`);
  });

  test('will not guess a derivative is lighter when the original has no recorded size', () => {
    // `size` is nullable on the original; short-circuiting the comparison to `true`
    // reintroduces exactly the heavier-derivative defect.
    const unsized = { ...upload, size: undefined };
    expect(resolveMedia(unsized, 400, SERVER)?.src).toBe(`${SERVER}/uploads/x.png`);
  });

  test('never swaps a still derivative in for an animated gif', () => {
    const gif = {
      url: '/uploads/a.gif',
      width: 800,
      size: 900,
      formats: { medium: { url: '/uploads/medium_a.gif', width: 750, size: 100 } }
    };
    expect(resolveMedia(gif, 400, SERVER)?.src).toBe(`${SERVER}/uploads/a.gif`);
  });

  test('every call site is measured against a representative ladder', async () => {
    // Assert SELECTION, not reachability: the previous guard only checked that
    // `target * 1.5 <= 1000`, which passed while both project routes silently returned the
    // untouched original. A target above the ladder is legitimate (see the 1110px case);
    // what must not happen is a route that could use a derivative and does not.
    const glob = new Bun.Glob('**/*.{astro,tsx}');
    const results: string[] = [];
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      const source = await Bun.file(`apps/astro/src/${file}`).text();
      for (const match of source.matchAll(/resolveMedia\(\s*[^,]+,\s*(\d+)/g)) {
        const target = Number(match[1]);
        const chosen = resolveMedia(upload, target, SERVER)!;
        results.push(
          `${file}:${target}:${chosen.src.includes('/uploads/x.png') ? 'ORIGINAL' : 'derivative'}`
        );
      }
    }
    expect(results.length).toBeGreaterThan(3);
    // Only the project detail route (a box wider than the whole ladder) may take the original.
    const originals = results.filter((r) => r.endsWith('ORIGINAL'));
    expect(originals.every((r) => r.includes('projects/[slug]'))).toBe(true);
  });
});
