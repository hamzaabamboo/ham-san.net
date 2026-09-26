import { describe, expect, test } from 'bun:test';
import { fontHref, namecardFontHref } from '../src/utils/fonts';

const read = async (path: string) => await Bun.file(path).text();

const INDEX_CSS = 'apps/astro/src/index.css';
const SRC = 'apps/astro/src';

// A family may be kept in a stack for visitors who already own it while not being
// downloaded — but only if the platform ships a face covering the SAME SCRIPT to fall
// through to. That is a property of the script, not of the author's judgement: an earlier
// version took a per-family list and passed while Noto Sans Thai was dropped behind
// Hiragino Sans and Yu Gothic, neither of which carries a single Thai glyph.
const SYSTEM_FACES: Record<string, string[]> = {
  // macOS and Windows both ship CJK serif and sans faces.
  'JP-serif': ['Hiragino Mincho ProN', 'Yu Mincho'],
  'JP-sans': ['Hiragino Sans', 'Yu Gothic']
  // No entry for Thai: neither platform ships a Thai face, so a Thai family can never be
  // dropped from the request.
};

const scriptOf = (family: string): string | undefined => {
  if (family.includes('Thai')) return undefined;
  if (!family.includes('JP')) return undefined;
  return family.includes('Serif') ? 'JP-serif' : 'JP-sans';
};

// Families deliberately not requested. Each is validated against SYSTEM_FACES below.
const LOCAL_ONLY = new Set(['Noto Serif JP']);

describe('locale font loading', () => {
  test('every family a locale stylesheet demands is requested for that locale', async () => {
    const css = await read(INDEX_CSS);

    for (const locale of ['ja', 'th']) {
      const block = css.match(new RegExp(`html:lang\\(${locale}\\)[^}]*}`, 'g')) ?? [];
      const families = new Set<string>();
      for (const rule of block) {
        for (const match of rule.matchAll(/'(Noto [^']+)'/g)) families.add(match[1]);
      }

      expect(families.size).toBeGreaterThan(0);
      const href = fontHref(locale);
      for (const family of families) {
        if (LOCAL_ONLY.has(family)) {
          // The script must have a platform face at all...
          const script = scriptOf(family);
          expect(script).toBeDefined();
          const substitutes = SYSTEM_FACES[script!];
          expect(substitutes?.length).toBeGreaterThan(0);
          // ...and the stack must actually continue to one of them.
          const stack = block.find((rule) => rule.includes(`'${family}'`))!;
          const after = stack.slice(stack.indexOf(`'${family}'`));
          expect(substitutes.some((substitute) => after.includes(`'${substitute}'`))).toBe(true);
          continue;
        }
        expect(href).toContain(family.replaceAll(' ', '+'));
      }
    }
  });

  test('english does not pay for CJK or Thai faces it never applies', () => {
    const href = fontHref('en');
    expect(href).not.toContain('Noto+Sans+JP');
    expect(href).not.toContain('Noto+Serif+JP');
    expect(href).not.toContain('Noto+Sans+Thai');
    expect(href).not.toContain('Noto+Serif+Thai');
    expect(href).toContain('Manrope');
    expect(href).toContain('Newsreader');
  });

  test('an unknown locale falls back to exactly the english set', () => {
    // Comparing the function to itself would pass even if it ignored `lang` entirely.
    const href = fontHref('xx');
    expect(href).toContain('Manrope');
    expect(href).toContain('Newsreader');
    expect(href).toContain('JetBrains+Mono');
    expect(href).not.toContain('Noto');
    expect(href).toBe(fontHref('en'));
  });

  test('the namecard requests only the family it actually applies', () => {
    // Verified in a browser: the namecard's unlayered global rule wins over index.css,
    // so its computed font-family is M PLUS 1p plus system faces only.
    const href = namecardFontHref();
    expect(href).toContain('M+PLUS+1p:wght@400;700');
    for (const unused of ['Manrope', 'Newsreader', 'JetBrains', 'Noto', 'Material+Symbols']) {
      expect(href).not.toContain(unused);
    }
  });

  test('newsreader ships a real italic face, not a synthesised oblique', () => {
    // Without the `ital` axis Google serves zero italic faces and every emphasis site
    // silently falls back to a mechanically slanted roman, with nothing else going red.
    const href = fontHref('en');
    // Headings are semibold, so an italic pinned at 400 would be synthetically bolded.
    // The italic axis must cover the same weight range as the roman.
    // Assert the axes and the ranges, not one spelling of the axis list: the `opsz` axis
    // was dropped for costing 293,624 B, and pinning it here failed a correctness guard
    // for a payload change that preserves every face.
    expect(href).toMatch(/Newsreader:ital,(?:opsz,)?wght@/);
    const spec = href.match(/Newsreader:ital,(?:opsz,)?wght@([^&]+)/)![1];
    const [roman, italic] = spec.split(';');
    expect(roman).toMatch(/^0,(?:6\.\.72,)?400\.\.800$/);
    // The italic must cover the same weight range, or emphasis at heading weight is
    // synthetically bolded.
    expect(italic).toMatch(/^1,(?:6\.\.72,)?400\.\.800$/);
    expect(roman.replace(/^0,/, '')).toBe(italic.replace(/^1,/, ''));
  });

  test('no icon webfont is loaded at all', async () => {
    // The Material Symbols face was 320,688 B of variable font on every route, behind a
    // render-blocking stylesheet, to draw nineteen glyphs. Those are now inline SVG in the
    // SSR output, so the request is gone entirely rather than merely tuned.
    const fonts = await read('apps/astro/src/utils/fonts.ts');
    expect(fonts).not.toContain('Material+Symbols');
    expect(fonts).not.toContain('ICON_HREF');

    const layout = await read('apps/astro/src/layouts/BaseLayout.astro');
    expect(layout).not.toContain('ICON_HREF');

    // ...and no source may fall back to the font's class, which would render nothing.
    const glob = new Bun.Glob('**/*.{astro,tsx}');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      scanned++;
      if ((await read(`apps/astro/src/${file}`)).includes('material-symbols-outlined')) {
        offenders.push(`src/${file}`);
      }
    }
    expect(scanned).toBeGreaterThan(150);
    expect(offenders).toEqual([]);
  });

  test('no font stylesheet is loaded via an inline onload swap', async () => {
    // ClientRouter re-inserts <link> elements parsed by DOMParser, which never compiles
    // inline event handlers, so a deferred sheet stays media="print" after a locale
    // switch and its faces are never applied.
    const layout = await read('apps/astro/src/layouts/BaseLayout.astro');
    expect(layout).not.toContain('onload="this.media=\'all\'"');
    expect(layout).toContain('<link href={fontsHref} rel="stylesheet" />');
  });
});

describe('atelier palette', () => {
  test('every referenced custom property is defined', async () => {
    const css = await read(INDEX_CSS);
    const defined = new Set(
      [...css.matchAll(/^\s*(--atelier-[a-z0-9-]+)\s*:/gm)].map((match) => match[1])
    );
    expect(defined.size).toBeGreaterThan(10);

    const glob = new Bun.Glob('**/*.{astro,tsx,ts,css}');
    const referenced = new Set<string>();
    for await (const file of glob.scan({ cwd: SRC })) {
      const source = await read(`${SRC}/${file}`);
      for (const match of source.matchAll(/var\(\s*(--atelier-[a-z0-9-]+)\s*[,)]/g)) {
        referenced.add(match[1]);
      }
    }

    expect(referenced.size).toBeGreaterThan(0);
    const missing = [...referenced].filter((name) => !defined.has(name));
    expect(missing).toEqual([]);
  });
});

describe('single source of truth', () => {
  test('the panda token mirror matches the css custom properties by name and value', async () => {
    const css = await read(INDEX_CSS);
    const ts = await read('apps/astro/src/theme/tokens/atelier.ts');

    const cssVars = new Map(
      [...css.matchAll(/^\s*--atelier-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/gm)].map(
        (match) => [match[1], match[2].toLowerCase()]
      )
    );

    // Flatten the nested token object to the same kebab names the CSS block uses.
    const tokens = new Map<string, string>();
    const path: string[] = [];
    for (const line of ts.split('\n')) {
      const open = line.match(/^\s*([A-Za-z]+):\s*\{\s*$/);
      const leaf = line.match(/^\s*([A-Za-z]+):\s*\{\s*value:\s*'(#[0-9a-fA-F]{3,8})'\s*\},?\s*$/);
      if (leaf) {
        const name = leaf[1] === 'DEFAULT' ? path.join('-') : [...path, leaf[1]].join('-');
        tokens.set(
          name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
          leaf[2].toLowerCase()
        );
      } else if (open) {
        path.push(open[1]);
      } else if (/^\s*\},?\s*$/.test(line)) {
        path.pop();
      }
    }

    expect(cssVars.size).toBeGreaterThan(10);
    expect(tokens.size).toBeGreaterThan(10);
    // Both directions: a rename, a swapped value, or an orphan token all fail here.
    expect(Object.fromEntries([...tokens].sort())).toEqual(Object.fromEntries([...cssVars].sort()));
  });

  test('locale files keep identical key sets, nested included', async () => {
    const flatten = (value: unknown, prefix = ''): string[] =>
      value && typeof value === 'object' && !Array.isArray(value)
        ? Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
            flatten(child, prefix ? `${prefix}.${key}` : key)
          )
        : [prefix];

    const glob = new Bun.Glob('*.json');
    const names = [...(await Array.fromAsync(glob.scan({ cwd: 'libs/i18n/en' })))].sort();
    expect(names.length).toBeGreaterThan(0);

    for (const name of names) {
      const keys = await Promise.all(
        ['en', 'ja', 'th'].map(async (locale) =>
          flatten(JSON.parse(await read(`libs/i18n/${locale}/${name}`))).sort()
        )
      );
      expect({ [name]: keys[1] }).toEqual({ [name]: keys[0] });
      expect({ [name]: keys[2] }).toEqual({ [name]: keys[0] });
    }
  });
});

describe('i18n reachability', () => {
  test('no locale key is stranded with nothing rendering it', async () => {
    // Hand-deleting orphans was needed five times. Skipping a whole namespace because one
    // template call touches it left 62% of keys unchecked, so resolve the dynamic keys
    // from the source instead of exempting their namespace.
    const sources: string[] = [];
    for (const root of ['apps/astro/src', 'apps/client/src']) {
      const glob = new Bun.Glob('**/*.{ts,tsx,astro,svelte}');
      for await (const file of glob.scan({ cwd: root })) {
        sources.push(await read(`${root}/${file}`));
      }
    }
    const blob = sources.join('\n');
    expect(sources.length).toBeGreaterThan(50);

    // `t('ns.key')` — the leading boundary stops `test(`/`expect(` matching.
    const literal = new Set(
      [...blob.matchAll(/(?<![\w$])\$?t\(\s*'([a-z0-9-]+)\.([a-z0-9.-]+)'/g)].map(
        (m) => `${m[1]}.${m[2]}`
      )
    );
    // Keys reached through indirection: `NAMECARD_PAGE_LINKS` stores them as `labelKey` /
    // `valueKey` strings and calls `t(link.labelKey)`, so no literal `t('ns.key')` exists in
    // source. Harvested from that one file, narrowly — three such keys shipped as visible
    // raw key names because nothing tied the reference to the catalogue.
    const namecardLinks = await read('libs/utils/namecard-page.ts');
    for (const match of namecardLinks.matchAll(
      /(?:labelKey|valueKey):\s*'([a-z0-9-]+)\.([a-z0-9.-]+)'/g
    )) {
      literal.add(`${match[1]}.${match[2]}`);
    }

    // Dynamic hobby keys come from the lookup tables in utils/hobby-labels.ts. Read them
    // from that file specifically: a repo-wide bare-string heuristic also matches icon
    // names and enum values, which silently whitelisted a dead key.
    const hobbyLabels = await read('apps/astro/src/utils/hobby-labels.ts');
    // Narrow on both axes. A file-wide right-hand-side match still harvests the
    // `field: 'label' | 'description'` annotation and the Intl option values
    // 'numeric'/'short'/'gregory' further down, each of which then whitelists an
    // unrelated key. Slice to the three copy-key tables, then require the prefix every
    // real key carries, so a table renamed out of the slice fails instead of passing.
    const tableStart = hobbyLabels.indexOf('const embedCopyKeys');
    const tableEnd = hobbyLabels.indexOf('type EmbedCopyKey');
    expect(tableStart).toBeGreaterThan(-1);
    expect(tableEnd).toBeGreaterThan(tableStart);
    const copyTables = hobbyLabels.slice(tableStart, tableEnd);
    const dynamicHobbyKeys = new Set(
      [...copyTables.matchAll(/:\s*'((?:embed|overview|metric)-[a-z0-9-]+)'/g)].map((m) => m[1])
    );
    // The tables carry every embed type; a slice that stops matching must not pass.
    expect(dynamicHobbyKeys.size).toBe(30);
    for (const forbidden of ['label', 'numeric', 'short', 'gregory']) {
      expect(dynamicHobbyKeys.has(forbidden)).toBe(false);
    }

    const flatten = (value: unknown, prefix = ''): string[] =>
      value && typeof value === 'object' && !Array.isArray(value)
        ? Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
            flatten(child, prefix ? `${prefix}.${key}` : key)
          )
        : [prefix];

    // Skill-category keys are built from CMS values via `t(`common.${toKebabCase(name)}`)`
    // and cannot be resolved from source. Enumerated so the rest of the namespace is still
    // checked rather than exempting all 189 keys in it.
    const cmsDerived = new Set([
      'common.frontend',
      'common.backend',
      'common.database',
      'common.dev-ops',
      'common.non-dev',
      'common.programming-language',
      // Enum_Tag_Type has a seventh member.
      'common.others'
    ]);

    const stranded: string[] = [];
    let checked = 0;
    const glob = new Bun.Glob('*.json');
    for await (const file of glob.scan({ cwd: 'libs/i18n/en' })) {
      const ns = file.replace('.json', '');
      for (const key of flatten(JSON.parse(await read(`libs/i18n/en/${file}`)))) {
        checked++;
        if (literal.has(`${ns}.${key}`)) continue;
        if (cmsDerived.has(`${ns}.${key}`)) continue;
        if (ns === 'hobbies' && dynamicHobbyKeys.has(key)) continue;
        stranded.push(`${ns}.${key}`);
      }
    }

    // Placeholders must match across locales too: the key-parity check compares NAMES, and
    // the interpolation guard builds its set from `en` alone, so a `{n}` present in `en` and
    // missing from `ja` would silently drop the number on that locale with the suite green.
    const placeholders = async (locale: string, file: string) => {
      const entries = JSON.parse(await read(`libs/i18n/${locale}/${file}`)) as Record<
        string,
        unknown
      >;
      const map = new Map<string, string>();
      for (const [key, value] of Object.entries(entries)) {
        if (typeof value !== 'string') continue;
        const found = [...value.matchAll(/\{[a-z]+\}/g)].map((m) => m[0]).sort();
        if (found.length) map.set(key, found.join(','));
      }
      return map;
    };
    const drift: string[] = [];
    const nsGlobPh = new Bun.Glob('*.json');
    for await (const file of nsGlobPh.scan({ cwd: 'libs/i18n/en' })) {
      const base = await placeholders('en', file);
      for (const locale of ['ja', 'th']) {
        const other = await placeholders(locale, file);
        for (const [key, shape] of base) {
          if (other.get(key) !== shape) drift.push(`${locale}/${file}:${key}`);
        }
      }
    }
    expect(drift).toEqual([]);

    // No namespace is exempt any more, so the corpus must be the whole key set.
    expect(checked).toBeGreaterThan(380);
    expect(stranded).toEqual([]);
  });
});

describe('locale stacks keep a system fallback for every script they carry', () => {
  test('every display stack ends in a CJK-capable system face', async () => {
    // CMS data carries Japanese names on every locale, including inside headings. The
    // key-parity guard harvests only `'Noto …'` families, so it cannot see a non-Noto
    // fallback being dropped — which is how `:lang(th)` lost its CJK serif twice, the
    // second time to a tidy-up whose rationale ("Japanese faces have no Thai coverage")
    // misread CSS fallback as per-stack rather than per-character.
    const css = await read(INDEX_CSS);
    const CJK_SERIF = ['Hiragino Mincho ProN', 'Yu Mincho'];
    const CJK_SANS = ['Hiragino Sans', 'Yu Gothic'];

    const declarations = [...css.matchAll(/--font-(display|body|code):\s*([^;]+);/g)];
    expect(declarations.length).toBeGreaterThanOrEqual(6);

    for (const [, slot, stack] of declarations) {
      const wanted = slot === 'display' ? CJK_SERIF : CJK_SANS;
      expect({
        slot,
        stack: stack.trim(),
        hasSystemCjk: wanted.some((f) => stack.includes(f))
      }).toEqual({ slot, stack: stack.trim(), hasSystemCjk: true });
    }
  });

  test('every weight the source declares is actually served by its own family', () => {
    // The earlier version checked every declared weight against Manrope's range alone, with
    // no idea which family the element used — so `fontWeight="800"` on `var(--font-code)`
    // (JetBrains Mono, requested at 400;500;700) sat in the nav brand, rendering
    // synthetically emboldened, while the suite stayed green.
    return (async () => {
      const fonts = await read('apps/astro/src/utils/fonts.ts');
      const discrete = (family: string) => {
        const list = fonts.match(new RegExp(`${family}:wght@([\\d;]+)`))?.[1];
        expect(list).toBeDefined();
        return new Set(list!.split(';').map(Number));
      };
      const ranged = (family: string) => {
        const bounds = fonts.match(new RegExp(`${family}:[^&']*?(\\d{3})\\.\\.(\\d{3})`));
        expect(bounds).not.toBeNull();
        return { low: Number(bounds![1]), high: Number(bounds![2]) };
      };

      const jetbrains = discrete('JetBrains\\+Mono');
      const notoSansJp = discrete('Noto\\+Sans\\+JP');
      const manrope = ranged('Manrope');
      const newsreader = ranged('Newsreader');

      // `--font-body` and `--font-code` both fall to a Noto face on ja/th, so a weight is
      // only truly served if BOTH the Latin family and that fallback carry it.
      const served = (slot: string, weight: number) => {
        if (slot === 'code') return jetbrains.has(weight);
        if (slot === 'body')
          return weight >= manrope.low && weight <= manrope.high && notoSansJp.has(weight);
        // `--font-display` falls to a system serif on ja, which has no requested weight set.
        return weight >= newsreader.low && weight <= newsreader.high;
      };

      const glob = new Bun.Glob('**/*.{astro,tsx,css}');
      const unserved: string[] = [];
      let scanned = 0;
      for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
        if (file.includes('namecard')) continue;
        scanned++;
        const source = await read(`apps/astro/src/${file}`);
        for (const match of source.matchAll(/font-weight:\s*(\d{3})|fontWeight=["']?(\d{3})/g)) {
          const weight = Number(match[1] ?? match[2]);
          // The family in force is the nearest one named above the declaration, inside the
          // same rule or element.
          const slot = source
            .slice(0, match.index)
            .match(/--font-(display|body|code)(?![\s\S]*--font-(display|body|code))/)?.[1];
          if (!slot) continue;
          if (!served(slot, weight)) unserved.push(`${file}: ${weight} on --font-${slot}`);
        }
      }
      expect(scanned).toBeGreaterThan(150);
      expect(unserved).toEqual([]);
    })();
  });
});

describe('templated copy is interpolated', () => {
  test('every key carrying {n} is consumed with a .replace at its call site', async () => {
    // Round 9 shipped a literal `{n}日` to the page after a second bare-label usage was
    // missed. The reachability guard matches `t('ns.key')` whether or not a `.replace`
    // follows, so nothing but discipline prevented a repeat.
    const templated = new Map<string, string>();
    const nsGlob = new Bun.Glob('*.json');
    for await (const file of nsGlob.scan({ cwd: 'libs/i18n/en' })) {
      const ns = file.replace('.json', '');
      const entries = JSON.parse(await read(`libs/i18n/en/${file}`)) as Record<string, unknown>;
      for (const [key, value] of Object.entries(entries)) {
        // Any `{placeholder}`, not just `{n}`: the hobby metric keys use `{count}` and were
        // invisible to this guard while sitting behind a fallback that re-creates the exact
        // defect it exists to prevent.
        if (typeof value === 'string' && /\{[a-z]+\}/.test(value)) {
          templated.set(`${ns}.${key}`, value.match(/\{[a-z]+\}/)![0]);
        }
      }
    }
    expect(templated.size).toBeGreaterThan(5);

    const bare: string[] = [];
    const glob = new Bun.Glob('**/*.{ts,tsx,astro}');
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      const source = await read(`apps/astro/src/${file}`);
      for (const match of source.matchAll(/\bt\(\s*'([a-z0-9-]+)\.([a-z0-9.-]+)'\s*\)/g)) {
        const key = `${match[1]}.${match[2]}`;
        const placeholder = templated.get(key);
        if (!placeholder) continue;
        // The interpolation may sit on an enclosing expression rather than on the call —
        // `(count === 1 ? t(a) : t(b)).replace('{n}', ...)` is correct. Require it within a
        // short window after the call, which still catches a label rendered bare.
        const end = match.index! + match[0].length;
        const escaped = placeholder.replace(/[{}]/g, (c) => `\\${c}`);
        if (!new RegExp(`\\.replace\\(\\s*'${escaped}'`).test(source.slice(end, end + 200))) {
          bare.push(`${file}: ${key}`);
        }
      }
    }
    expect(bare).toEqual([]);
  });
});

describe('font families stay tokenised', () => {
  test('no source outside the token definitions names a family literally', async () => {
    // This defect class recurred in rounds 7, 8, 9, 11 and 12: a literal family in an
    // `@layer utilities` rule or an unlayered block outranks the `html:lang(ja|th)`
    // overrides in `@layer base`, so CJK and Thai text falls to a generic face while the
    // Noto webfont is still downloaded. Routing every site through the custom properties
    // is what makes the locale overrides reachable.
    //
    // Match the family name anywhere in a font-family value rather than requiring a
    // trailing generic. The earlier shape only caught `X, serif` and sailed past
    // `X, Georgia, serif`, `"X", sans-serif` and `JetBrains Mono, Noto Sans JP, monospace`
    // — the last being exactly the round-11 mono defect in its stacked form.
    const allowed = new Set([
      'src/index.css',
      'src/theme/tokens/atelier.ts',
      'src/utils/fonts.ts',
      // The namecard is a deliberately frozen, self-contained print document.
      'src/layouts/NamecardLayout.astro'
    ]);
    const BANNED =
      /(JetBrains Mono|Manrope|Newsreader|Noto Sans JP|Noto Serif JP|Noto Sans Thai|Noto Serif Thai)/;

    const offenders: string[] = [];
    let scanned = 0;
    let declarations = 0;
    const seen = new Set<string>();

    const glob = new Bun.Glob('**/*.{ts,tsx,astro,css}');
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      if (allowed.has(`src/${file}`)) continue;
      if (file.startsWith('namecard/') || file.includes('/namecard/')) continue;
      scanned++;
      seen.add(`src/${file}`);
      // Strip comment bodies first: an explanatory comment naming a family is not a
      // declaration, and flagging one fails a font test for a legitimate change.
      const source = (await read(`apps/astro/src/${file}`))
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

      // Four shapes carry a family: a CSS `font-family:` declaration, the `font:`
      // shorthand, a redefinition of one of the `--font-*` custom properties (how a
      // stylesheet shadows the `html:lang()` overrides without ever naming `font-family`),
      // and a JSX/object `fontFamily` whose value may be a ternary or an identifier rather
      // than a bare string literal — a locale ternary being the literal subject here.
      for (const match of source.matchAll(
        /(?:(?<![-\w])font|font-family|--font-[a-z-]+)\s*:\s*([^;{}]+)|fontFamily\s*[:=]\s*([^\n>]+)/g
      )) {
        const value = match[1] ?? match[2] ?? '';
        declarations++;
        if (BANNED.test(value)) offenders.push(`src/${file}: ${value.trim().slice(0, 60)}`);
      }
    }

    // A floor plus an explicit membership check, rather than an exact file count: pinning
    // the count makes this font test fail whenever anyone adds an unrelated component, with
    // nothing in the message pointing at the cause. What the pin was actually buying is
    // that the highest-risk files stay in the scan set, so assert that directly.
    expect(scanned).toBeGreaterThanOrEqual(270);
    for (const required of [
      'src/styles/events-report.css',
      'src/theme/global-css.ts',
      'src/components/hobbies/hobbyStyles.tsx'
    ]) {
      expect(seen.has(required)).toBe(true);
    }
    expect(declarations).toBeGreaterThan(20);
    expect(offenders).toEqual([]);
  });
});
