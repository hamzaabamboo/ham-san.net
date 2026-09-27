import { describe, expect, test } from 'bun:test';

const read = async (path: string) => await Bun.file(path).text();

const LAYOUTS = [
  'apps/astro/src/layouts/BaseLayout.astro',
  'apps/astro/src/layouts/NamecardLayout.astro'
];

describe('static assets referenced by source exist on disk', () => {
  test('every root-relative asset path resolves in public/', async () => {
    // A three-file corpus missed `/images/placeholder-project.jpg` and the rss favicon —
    // deleting either would have gone green, which is the exact class of mistake (a
    // deleted favicon) this guard was written for. Scan the whole tree instead.
    const referenced = new Set<string>();
    // `.css` is in the glob too, with a `url()` pattern: a stylesheet pointing at a deleted
    // file is the same deleted-asset failure this guard exists for, one file type over.
    const glob = new Bun.Glob('**/*.{astro,tsx,ts,css}');
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      scanned++;
      const source = await read(`apps/astro/src/${file}`);
      for (const match of source.matchAll(
        /["'`](\/[\w./-]+\.(?:png|svg|jpg|jpeg|webp|ico))["'`]/g
      )) {
        referenced.add(match[1]);
      }
      for (const match of source.matchAll(
        /url\(\s*['"]?(\/[\w./-]+\.(?:png|svg|jpg|jpeg|webp|ico))/g
      )) {
        referenced.add(match[1]);
      }
    }

    expect(scanned).toBeGreaterThan(200);
    // The nav mark is now inline SVG, so the referenced set is the two favicons,
    // the share card and the project placeholder.
    expect(referenced.size).toBeGreaterThanOrEqual(4);
    const missing: string[] = [];
    for (const path of referenced) {
      if (!(await Bun.file(`apps/astro/public${path}`).exists())) missing.push(path);
    }
    expect(missing).toEqual([]);
  });
});

describe('share cards', () => {
  test('both layouts emit an image unconditionally with a default', async () => {
    for (const layout of LAYOUTS) {
      const source = await read(layout);
      expect(source).toContain("'/og-default.png'");
      expect(source).toContain('<meta property="og:image" content={socialImage} />');
      expect(source).toContain('<meta name="twitter:image" content={socialImage} />');
      expect(source).toContain('<meta name="twitter:card" content="summary_large_image" />');
      // A gated tag is how every page ended up with an imageless card.
      expect(source).not.toContain('{image && <meta property="og:image"');
    }
  });
});

describe('hydration directives', () => {
  test('no island hydrates eagerly outside the allowlist', async () => {
    // Eager hydration pulls react + react-dom onto the critical path.
    const allowlist = new Set<string>();

    const glob = new Bun.Glob('**/*.astro');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      const source = await read(`apps/astro/src/${file}`);
      scanned++;
      if (/client:(load|only)/.test(source) && !allowlist.has(file)) offenders.push(file);
    }

    expect(scanned).toBeGreaterThan(15);
    expect(offenders).toEqual([]);
  });
});

describe('cms media requests', () => {
  test('no astro source asks the CMS origin for a transform it ignores', async () => {
    // Verified against the origin: `?w=1` returns the same 783,526 bytes as the bare URL,
    // so `getMediaUrl`'s `format`/`w`/`h`/`resize` params are decorative. A guard asserting
    // those params are present proves nothing. `resolveMedia` instead picks a real Strapi
    // derivative file out of `formats`, which is a distinct object on disk.
    const glob = new Bun.Glob('**/*.{astro,tsx,ts}');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      scanned++;
      const source = await read(`apps/astro/src/${file}`);
      if (/\bgetMediaUrl\s*\(/.test(source)) offenders.push(`src/${file}`);
    }
    expect(scanned).toBeGreaterThan(200);
    expect(offenders).toEqual([]);
  });

  test('every resolveMedia call bounds the box it is rendering into', async () => {
    const glob = new Bun.Glob('**/*.{astro,tsx}');
    const unbounded: string[] = [];
    let calls = 0;

    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      const source = await read(`apps/astro/src/${file}`);

      // Balance parentheses rather than regex-matching a delimiter whitelist: JSX
      // expression, ternary and object-literal call shapes all defeat a lazy regex.
      let index = source.indexOf('resolveMedia(');
      while (index !== -1) {
        calls++;
        let depth = 0;
        let cursor = source.indexOf('(', index);
        const argsStart = cursor + 1;
        do {
          if (source[cursor] === '(') depth++;
          else if (source[cursor] === ')') depth--;
          cursor++;
        } while (depth > 0 && cursor < source.length);

        const args = source.slice(argsStart, cursor - 1);
        // Second argument is the target width and must be a number literal, not a guess.
        const rest = args.slice(args.indexOf(',') + 1).trim();
        if (!/^\d{2,4}\b/.test(rest) || !/PUBLIC_API_URL/.test(args)) {
          unbounded.push(`${file}: resolveMedia(${args.replace(/\s+/g, ' ').slice(0, 60)})`);
        }
        index = source.indexOf('resolveMedia(', cursor);
      }
    }

    expect(calls).toBeGreaterThan(3);
    expect(unbounded).toEqual([]);
  });
});

describe('grid tracks cannot be widened by unbreakable text', () => {
  test('no grid template uses a bare fr track', async () => {
    // `1fr` carries an implicit `min-width: auto`, so its min-content sets the track. With
    // `word-break: auto-phrase` a long Japanese title is unbreakable, and that min-content
    // pushed the track past the viewport — measured scrollWidth 404 at 390px on
    // /ja/projects and 322 at 320px on /ja/about. Neither showed on /en or /th.
    //
    // Three things this guard got wrong before and now covers: CSS files were not scanned
    // at all (nine bare tracks lived there), the value was read only to end-of-line so a
    // multi-line responsive object was invisible, and a lookbehind exempted `repeat(2,1fr)`
    // written without a space — a spelling already used in this repo.
    const glob = new Bun.Glob('**/*.{astro,tsx,css}');
    const offenders: string[] = [];
    let scanned = 0;
    let declarations = 0;

    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      // The namecard is a frozen print sheet sized in mm; it has no viewport to overflow.
      if (file.includes('namecard')) continue;
      scanned++;
      const source = await read(`apps/astro/src/${file}`);

      for (const match of source.matchAll(
        /grid(?:-?[Tt]emplate)?(?:-?[Aa]uto)?(?:-?(?:[Cc]olumns|[Rr]ows))?\s*[:=]/g
      )) {
        // Read the whole value by balancing braces and parens rather than stopping at the
        // line end, so a responsive object spanning several lines is inspected whole.
        let cursor = match.index! + match[0].length;
        let depth = 0;
        const start = cursor;
        while (cursor < source.length) {
          const ch = source[cursor];
          if (ch === '{' || ch === '(') depth++;
          else if (ch === '}' || ch === ')') {
            depth--;
            if (depth <= 0) {
              cursor++;
              break;
            }
          } else if (depth === 0 && (ch === ';' || ch === '}')) break;
          cursor++;
        }
        const value = source.slice(start, cursor);
        declarations++;
        // One level of nesting inside `minmax(...)`: `[^)]*` stopped at the first `)` of a
        // nested `min(100%, 320px)` and then matched the `1fr` that minmax already bounds.
        const withoutMinmax = value.replace(/minmax\((?:[^()]|\([^()]*\))*\)/g, '');
        if (/\d*\.?\d*fr\b/.test(withoutMinmax)) {
          offenders.push(`src/${file}: ${match[0]}${value.replace(/\s+/g, ' ').slice(0, 60)}`);
        }
      }
    }

    // astro + tsx + the two stylesheets.
    expect(scanned).toBeGreaterThan(150);
    expect(declarations).toBeGreaterThan(20);
    expect(offenders).toEqual([]);
  });
});

describe('scroll handling', () => {
  test('the nav scroll listener stays passive and frame-coalesced', async () => {
    const source = await read('apps/astro/src/components/layout/Navigation.astro');
    expect(source).toContain("addEventListener('scroll', onScroll, { passive: true })");
    expect(source).toContain('requestAnimationFrame(updateNav)');
  });

  test('native smooth scrolling does not fight Lenis', async () => {
    const css = await read('apps/astro/src/index.css');
    // Lenis drives the scroller; a native `scroll-behavior: smooth` on html double-drives it.
    // Balance braces from the `@media` opener: a non-greedy strip to the first nested `}`
    // left later rules in the block visible to the assertion below.
    const outsideReducedMotion = (() => {
      const start = css.indexOf('@media (prefers-reduced-motion');
      if (start === -1) return css;
      let depth = 0;
      let cursor = css.indexOf('{', start);
      do {
        if (css[cursor] === '{') depth++;
        else if (css[cursor] === '}') depth--;
        cursor++;
      } while (depth > 0 && cursor < css.length);
      return css.slice(0, start) + css.slice(cursor);
    })();
    expect(outsideReducedMotion).not.toMatch(/scroll-behavior\s*:\s*smooth/);
  });
});

describe('single signal colour', () => {
  test('the document palette stays amber', async () => {
    // Reverting this token re-seeds a whole second hue through every Park UI recipe,
    // and no hardcoded-colour rule fires on a token name.
    const source = await read('apps/astro/src/theme/global-css.ts');
    expect(source).toContain("colorPalette: 'amber'");
    expect(source).not.toMatch(/colorPalette:\s*'(blue|red|green|orange|purple|mauve|sand)'/);
  });

  test('the amber ramp entries that reach the page are the system accent', async () => {
    // `colorPalette: 'amber'` seeds the Radix ramp, whose alpha steps drift from hue 15.7
    // to 46.4 degrees. `a11` reaches `color` and `a7` reaches `border-color` on rendered
    // pages, so those two must be the atelier accent (41.4 degrees) and not Radix's own.
    const source = await read('apps/astro/src/theme/colors/amber.ts');
    const dark = (token: string) =>
      source.match(new RegExp(`${token}: \\{ value: \\{ _light: '[^']+', _dark: '([^']+)'`))?.[1];
    expect(dark('a11')).toBe('#ffb000');
    expect(dark('a7')).toBe('#ffb00067');
    expect(dark('a9')).toBe('#ffb000');
    // The solid ramp carries the same value under a different key.
    expect(source).not.toContain('#ffca16');
  });

  test('no forbidden colour ramp is registered or referenced', async () => {
    // The design system permits grayscale plus one amber. Registering blue/red/green/
    // purple/orange put 16,371 B of unusable ramps in the shipped sheet and kept the
    // second-hue regression vector open — both the round-3 blue link and the round-15
    // Radix amber arrived through this registration.
    // Match the defect class, not the two historical spellings: `blue: { ...blue }`,
    // `blue: blueRamp` and an aliased import all reach the same place.
    const config = await read('apps/astro/panda.config.ts');
    const theme = config.slice(config.indexOf('theme:'));
    for (const hue of ['blue', 'red', 'green', 'purple', 'orange']) {
      expect(theme).not.toMatch(new RegExp(`\\b${hue}\\s*:`));
    }

    // ...and no recipe may reach for one by name.
    // The whole tree, both quote styles, and the JSX prop form — not just theme/*.ts.
    const glob = new Bun.Glob('**/*.{ts,tsx,astro}');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      scanned++;
      const source = await read(`apps/astro/src/${file}`);
      if (
        /colorPalette\s*[:=]\s*['"{]?\s*['"](blue|red|green|purple|orange|mauve)['"]/.test(source)
      ) {
        offenders.push(`src/${file}`);
      }
    }
    expect(scanned).toBeGreaterThan(5);
    expect(offenders).toEqual([]);

    // ...and nothing anywhere in the app may reference one by token name. Panda's base
    // preset still DEFINES 55 tokens for these five hues (see Known remaining); what must
    // never happen is a rule consuming one, which is how a second hue reaches a page.
    const appGlob = new Bun.Glob('**/*.{ts,tsx,astro,css}');
    const consumers: string[] = [];
    let appScanned = 0;
    for await (const file of appGlob.scan({ cwd: 'apps/astro/src' })) {
      appScanned++;
      const source = await read(`apps/astro/src/${file}`);
      if (/var\(--colors-(blue|red|green|purple|orange)-/.test(source)) {
        consumers.push(`src/${file}`);
      }
      if (/\{colors\.(blue|red|green|purple|orange)\./.test(source)) consumers.push(`src/${file}`);
      // Panda's style-prop spelling resolves against the base preset's ramps, which still
      // ship, so `color="red.500"` would silently paint a second hue.
      if (
        /\b(color|bg|background|backgroundColor|borderColor|fill|stroke)\s*[:=]\s*['"](blue|red|green|purple|orange)\./.test(
          source
        )
      ) {
        consumers.push(`src/${file}`);
      }
    }
    expect(appScanned).toBeGreaterThan(200);
    expect(consumers).toEqual([]);
  });

  test('mark uses the accent, not a second hue', async () => {
    const source = await read('apps/astro/src/theme/global-css.ts');
    const markBlock = source.slice(
      source.indexOf('mark:'),
      source.indexOf('}', source.indexOf('mark:'))
    );
    expect(markBlock).toContain("bg: 'var(--atelier-accent)'");
    expect(markBlock).not.toMatch(/blue|green|red|purple|orange/);
  });
});

describe('cache headers', () => {
  test('every data-backed locale page sets a CDN cache header on every branch', async () => {
    const glob = new Bun.Glob('[[]locale[]]/**/*.{astro,ts}');
    const missing: string[] = [];
    const beforeCatch: string[] = [];
    const badValue: string[] = [];
    const uncoveredBranch: string[] = [];

    // Extract the second argument of a call by balancing parens, so a ternary or a
    // multi-line call is read whole rather than sampled by a fixed-width slice.
    const secondArg = (source: string, from: number) => {
      let depth = 0;
      let cursor = source.indexOf('(', from);
      const argsStart = cursor + 1;
      do {
        if (source[cursor] === '(') depth++;
        else if (source[cursor] === ')') depth--;
        cursor++;
      } while (depth > 0 && cursor < source.length);
      const args = source.slice(argsStart, cursor - 1);
      return args.slice(args.indexOf(',') + 1).trim();
    };

    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src/pages' })) {
      const source = await read(`apps/astro/src/pages/${file}`);
      if (file.includes('namecard')) continue;
      if (!/CDN-Cache-Control|Astro\.response|new Response/.test(source)) continue;
      scanned++;

      // Endpoints declare headers as an object literal rather than via headers.set().
      const sets = [
        ...source.matchAll(/headers\.set\(\s*'CDN-Cache-Control'/g),
        ...source.matchAll(/'CDN-Cache-Control'\s*:/g)
      ].sort((a, b) => a.index! - b.index!);
      if (sets.length === 0) {
        missing.push(file);
        continue;
      }

      const firstCatch = source.indexOf('} catch');
      if (firstCatch !== -1 && sets[0].index! < firstCatch) beforeCatch.push(file);

      // Every string literal passed as the value, including both arms of a ternary, must
      // be a real cache directive. A bare identifier is a computed value and is allowed.
      const values = sets.map((set) =>
        set[0].includes('headers.set')
          ? secondArg(source, set.index!)
          : source
              .slice(set.index! + set[0].length)
              .split('\n')
              .slice(0, 4)
              .join('\n')
      );
      for (const value of values) {
        for (const literal of [...value.matchAll(/'([^']*)'/g)].map((m) => m[1])) {
          if (!/^(public|private|no-store|no-cache)/.test(literal)) {
            badValue.push(`${file}: ${literal}`);
          }
        }
      }

      // A page that can degrade must be able to emit an uncacheable header, otherwise the
      // failure gets cached. Satisfied by a `no-store` literal or a computed value.
      const canDegrade = /Astro\.response\.status\s*=|Unavailable/.test(source);
      // Legitimate shapes: an explicit `no-store`, a ternary that picks a shorter TTL on
      // failure, or a computed value carrying status and directive together.
      // The DEGRADED arm specifically, not the mere presence of a ternary: both arms of
      // `cmsUnavailable ? 'public, max-age=3600' : 'public, ...'` start with `public`, which
      // caches a truncated 503 at the edge for an hour.
      const maxAge = (arm: string) => Number(arm.match(/max-age=(\d+)/)?.[1] ?? Infinity);
      const hasDegradedPath = values.some((value) => {
        const ternary = value.match(/\?([^:]+):(.+)$/);
        if (ternary) {
          const [, degraded, healthy] = ternary;
          // The degraded arm must actually be weaker. Both arms starting with `public,
          // max-age=3600` satisfies "there is a ternary" while caching a truncated 503 at
          // the edge for an hour.
          return /no-store|no-cache/.test(degraded) || maxAge(degraded) < maxAge(healthy);
        }
        return value.includes('no-store') || /^[A-Za-z_$][\w$.]*$/.test(value);
      });
      if (canDegrade && !hasDegradedPath) {
        uncoveredBranch.push(`${file}: can degrade but every value is unconditionally cacheable`);
      }
    }

    // Pin the exact corpus size: a mutation that drops a file out of the scan set must
    // fail on the count, not slip under a `greaterThan` floor with one file of margin.
    expect(scanned).toBe(15);
    expect(missing).toEqual([]);
    expect(beforeCatch).toEqual([]);
    expect(badValue).toEqual([]);
    expect(uncoveredBranch).toEqual([]);
  });

  test('the outline asset proxy is cacheable', async () => {
    const source = await read('apps/astro/src/pages/api/outline-asset.ts');
    // `toContain('CDN-Cache-Control')` would also pass for `no-store` or a comment.
    expect(source).toMatch(/CDN-Cache-Control',\s*'public, max-age=\d+/);
    expect(source).toContain('upstreamResponse.ok');
  });
});

describe('namecard font request', () => {
  test('requests only the two weights the namecard uses', async () => {
    const source = await read('apps/astro/src/utils/fonts.ts');
    const weights = source.match(/M\+PLUS\+1p:wght@([\d;]+)/);
    expect(weights).not.toBeNull();
    expect(weights![1].split(';')).toEqual(['400', '700']);
  });
});

describe('client islands stay free of the i18n corpus', () => {
  test('the drawer takes resolved strings rather than importing the locale data', async () => {
    // A value import from ~/i18n/ui or ~/i18n/utils pulls all ten namespaces in three
    // locales into this island's chunk: measured 73,166 B raw / 20,021 B gzip before the
    // fix, 4,188 B / 1,755 B after. A type-only import is erased and stays fine.
    // Relative specifiers are already used elsewhere in the tree, so matching only the
    // `~/i18n/...` alias would let `'../../i18n/utils'` back in with the guard green.
    const source = await read('apps/astro/src/components/layout/Sidebar.tsx');
    const valueImports = [
      // Any i18n specifier, not just the `ui`/`utils` leaves: the corpus actually lives
      // behind `i18n/index`, so importing that directly bypassed the old pattern entirely.
      // `i18n/path` is exempt — it is a pure string helper with no imports of its own.
      ...source.matchAll(/^import\s+(?!type\b)([^;]*?)\s+from\s+'[^']*i18n\/(?!path')[^']*'/gm),
      ...source.matchAll(/^import\s+(?!type\b)([^;]*?)\s+from\s+'[^']*i18n'/gm)
    ];
    expect(valueImports.map((m) => m[0])).toEqual([]);
    expect(source).not.toMatch(/\buseTranslations\s*\(/);

    // ...and the strings must still arrive, or the labels silently become undefined.
    expect(source).toContain('labels.menuOpen');
    expect(source).toContain('labels.menuClose');
    expect(source).toContain('labels.menu');
    expect(source).toContain('labels.language');
    expect(source).toMatch(/locales\.map/);
  });
});

describe('the guardrails reach CI', () => {
  test('the lint target that CI runs carries a warning ceiling', async () => {
    // Verified empirically: `nx run astro:lint` exits 0 at 50 warnings and 1 at 51, so
    // the ceiling on the nx target is what actually gates CI via `bun run check`.
    const project = JSON.parse(await read('apps/astro/project.json'));
    const ceiling = project.targets.lint.options.maxWarnings;
    expect(typeof ceiling).toBe('number');
    expect(ceiling).toBeLessThanOrEqual(50);

    // The package script is the local entry point and must agree with it.
    const app = JSON.parse(await read('apps/astro/package.json'));
    const scripted = app.scripts.lint.match(/--max-warnings=(\d+)/);
    expect(scripted).not.toBeNull();
    expect(Number(scripted![1])).toBe(ceiling);

    // ...and the ceiling only executes if root `check` still runs that target.
    const root = JSON.parse(await read('package.json'));
    expect(root.scripts.check).toMatch(/-t\s*lint/);
    expect(root.scripts.check).toMatch(/\bastro\b/);
  });

  test('the gate type-checks, and not from cache', async () => {
    // Nothing type-checked for the whole session: `tsc` skips .astro files, `astro check`
    // ran only inside `astro build`, and CI never builds. Two type errors were live, and
    // the claim that an unmapped icon name is "a build error" was false because of it.
    const root = JSON.parse(await read('package.json'));
    expect(root.scripts.check).toMatch(/\bcompile\b/);

    const project = JSON.parse(await read('apps/astro/project.json'));
    const compile = project.targets.compile;
    expect(compile.options.command).toMatch(/tsc[^&]*--noEmit/);
    expect(compile.options.command).toMatch(/astro check/);
    // A correctness gate served from cache reported a stale pass over a live type error.
    expect(compile.cache).toBe(false);
  });

  test('the gate covers libs, not just the two nx projects', async () => {
    // `libs/` is not an nx project, so `nx run-many -p client, astro` never reached it.
    // A dead import and an unformatted test file both survived a fully green gate there.
    const root = JSON.parse(await read('package.json'));
    expect(root.scripts.check).toMatch(/check:libs/);
    expect(root.scripts['check:libs']).toMatch(/libs\/\*\*/);
  });

  test('ci runs both the check and the test suite', async () => {
    const ci = await read('.github/workflows/ci.yml');
    expect(ci).toContain('bun run check');
    expect(ci).toMatch(/run:\s*bun test/);
  });

  test('nothing deploys past a red gate', async () => {
    // ci.yml and deploy.yml both fire on push, so they race: a red test run did not stop
    // a production deploy. The gate must be a job inside deploy.yml that the container
    // builds AND the deploy itself depend on — the deploy runs under `always()`, so a gate
    // missing from its `needs` reads as "skipped" rather than "failure" and lets it through.
    const deploy = await read('.github/workflows/deploy.yml');

    expect(deploy).toMatch(/^ {2}verify:/m);
    const verify = deploy.slice(deploy.indexOf('  verify:'), deploy.indexOf('  detect-changes:'));
    expect(verify).toContain('bun run check');
    expect(verify).toMatch(/run:\s*bun test/);

    for (const job of ['build-push-frontend', 'build-push-backend']) {
      const start = deploy.indexOf(`  ${job}:`);
      expect(start).toBeGreaterThan(-1);
      const needs = deploy.slice(start, start + 400).match(/needs:.*/)?.[0] ?? '';
      expect(needs).toContain('verify');
    }

    const deployJob = deploy.slice(deploy.indexOf('  Deploy:'));
    const deployNeeds = deployJob.slice(0, deployJob.indexOf('runs-on:'));
    expect(deployNeeds).toContain('verify');

    // Membership in `needs` is only half of it: under `always()` a failed dependency still
    // lets the job run unless the condition says otherwise. Both clauses are load-bearing.
    const deployIf = deployJob.match(/if:.*/)?.[0] ?? '';
    expect(deployIf).toContain("!contains(needs.*.result, 'failure')");
    expect(deployIf).toContain("!contains(needs.*.result, 'cancelled')");

    // A gate that cannot fail is not a gate.
    expect(verify).not.toMatch(/\|\|\s*true/);
    expect(verify).not.toContain('continue-on-error');
  });
});

describe('round-17 design fixes stay fixed', () => {
  test('elevation is hard-edged and grayscale', async () => {
    // The Park-UI default carried an 8px blur and `{colors.gray.a7}` — the Radix mauve
    // alpha ramp, measured rgba(238,233,255,0.25) at hue 252 on the live namecard.
    const source = (await read('apps/astro/src/theme/semantic-tokens/shadows.ts')).replace(
      /\/\/[^\n]*/g,
      ''
    );
    expect(source).not.toMatch(/\{colors\.gray\./);
    expect(source).not.toMatch(/\{colors\.(blue|red|green|purple|orange|mauve)\./);
    // Every offset must have a zero blur radius: `Npx Npx 0px 0px`.
    const shadows = [...source.matchAll(/\$\{offset\} \$\{offset\} (\S+) (\S+)/g)];
    expect(shadows.length).toBeGreaterThan(0);
    for (const [, blur, spread] of shadows) {
      expect(blur).toBe('0px');
      expect(spread).toBe('0px');
    }
  });

  test('image treatments go through the tokens, not literals', async () => {
    // Six call sites had drifted into three different spellings of one treatment.
    const glob = new Bun.Glob('**/*.{ts,tsx,astro,css}');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      if (file === 'index.css' || file.includes('namecard')) continue;
      scanned++;
      const source = (await read(`apps/astro/src/${file}`))
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
      if (/filter[^;\n]*\b(saturate|brightness|sepia)\(/.test(source))
        offenders.push(`src/${file}`);
    }
    expect(scanned).toBeGreaterThan(150);
    expect(offenders).toEqual([]);

    const css = await read('apps/astro/src/index.css');
    expect(css).toContain('--atelier-image-rest:');
    expect(css).toContain('--atelier-image-hover:');
  });

  test('the events page has one percent precision', async () => {
    // Two formatters over the same values printed "7%" and "6.9%" above the same fraction.
    const source = await read('apps/astro/src/pages/[locale]/events/index.astro');
    expect(source).not.toContain('percentFormatter');
    expect(source).not.toMatch(/style:\s*'percent'/);
  });

  test('the heatmap distinguishes empty from populated, and the legend agrees', async () => {
    const css = (await read('apps/astro/src/styles/events-report.css')).replace(
      /\/\*[\s\S]*?\*\//g,
      ''
    );
    const emptyCell = css.slice(css.indexOf("span[data-empty='true']"));
    expect(emptyCell.slice(0, 260)).toMatch(/border-color:\s*var\(--atelier-outline\)/);
    expect(emptyCell.slice(0, 260)).toMatch(/background:\s*var\(--atelier-surface-high\)/);
    // The legend's first key must render the same state it teaches.
    const legend = css.slice(css.indexOf('.event-report__heatmap-legend i {'));
    expect(legend.slice(0, 220)).toMatch(/background:\s*var\(--atelier-surface-high\)/);
  });

  test('contact sections are landmarks, not generic groups', async () => {
    // `role="group"` never appears in a screen reader's landmark rotor.
    const source = await read('apps/astro/src/pages/[locale]/contact/index.astro');
    expect(source).not.toMatch(/role="group"/);
    expect((source.match(/role="region"/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});

describe('icons resolve to the glyph they name', () => {
  test('every name reachable by <Glyph> is mapped', async () => {
    // The font migration replaced a payload problem with a name->glyph problem, and the
    // guard written for it only checked the font was gone. Eight `/events` cards shipped
    // drawing a chain-link because an unmapped name fell through a silent `?? FaLink`.
    const glyph = await read('apps/astro/src/components/ui/glyph.tsx');
    const mapped = new Set(
      [...glyph.matchAll(/^ {2}([a-z_]+):\s*[A-Z][a-zA-Z]+/gm)].map((m) => m[1])
    );
    expect(mapped.size).toBeGreaterThan(15);
    // The outlined Material cut, not a solid family: the system is built on exposed
    // strokes, and the first migration silently swapped hairlines for solid masses.
    expect(glyph).toMatch(/from 'react-icons\/md'/);
    expect(glyph).not.toMatch(/from 'react-icons\/fa'/);
    // `react-icons/md` ships the FILLED cut alongside the outlined one, so pinning the
    // package alone lets `MdMenu` back in beside `MdOutlineMenu`. Check the identifiers.
    for (const source of [glyph, await read('apps/astro/src/components/layout/Sidebar.tsx')]) {
      const filled = [...source.matchAll(/\bMd(?!Outline)([A-Z][a-zA-Z]*)\b/g)].map((m) => m[0]);
      expect(filled).toEqual([]);
    }
    // The fallback must be gone: an unmapped name has to be a build error, not a picture.
    expect(glyph).not.toMatch(/\?\?\s*[A-Z][a-zA-Z]+/);
    expect(glyph).toMatch(/name: GlyphName/);

    const glob = new Bun.Glob('**/*.{astro,tsx}');
    const unmapped: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      scanned++;
      const source = await read(`apps/astro/src/${file}`);
      if (!source.includes('<Glyph')) continue;
      for (const match of source.matchAll(/<Glyph[^>]*?name="([a-z_]+)"/g)) {
        if (!mapped.has(match[1])) unmapped.push(`src/${file}: ${match[1]}`);
      }
      // Names that reach <Glyph name={item.icon}> via a data literal.
      for (const match of source.matchAll(/\bicon:\s*'([a-z_]+)'/g)) {
        if (!mapped.has(match[1])) unmapped.push(`src/${file}: icon:${match[1]}`);
      }
    }
    expect(scanned).toBeGreaterThan(150);
    expect(unmapped).toEqual([]);
  });

  test('every class an icon is sized by actually exists', async () => {
    // `atelier-icon-lg` / `-sm` were referenced by three call sites and defined nowhere, so
    // those icons rendered at 16px in the inherited colour instead of 36px amber.
    const css = await read('apps/astro/src/index.css');
    const report = await read('apps/astro/src/styles/events-report.css');
    const glob = new Bun.Glob('**/*.{astro,tsx}');
    const undefinedClasses: string[] = [];
    let matched = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src' })) {
      const source = await read(`apps/astro/src/${file}`);
      for (const match of source.matchAll(/<Glyph[^>]*className="([a-z0-9-]+)"/g)) {
        matched++;
        if (!css.includes(`.${match[1]}`) && !report.includes(`.${match[1]}`)) {
          undefinedClasses.push(`src/${file}: .${match[1]}`);
        }
      }
    }
    expect(matched).toBeGreaterThanOrEqual(5);
    expect(undefinedClasses).toEqual([]);

    // ...and the three /events icon groups keep an explicit size after the font removal.
    for (const selector of [
      '.event-report__highlight-grid svg',
      '.event-report__highlights svg',
      '.event-report__fallback svg'
    ]) {
      expect(report).toContain(selector);
    }
  });
});

describe('round-20 layout and print fixes stay fixed', () => {
  test('print output is ink-on-paper and does not repeat fixed chrome', async () => {
    // Chrome repeats `position: fixed` elements on every printed page — the skip link
    // printed twice over the /about content — and defaults "Background graphics" off,
    // which drops the dark canvas while keeping the light text colour.
    const css = await read('apps/astro/src/index.css');
    const blocks = [...css.matchAll(/@media print \{([\s\S]*?)\n\}/g)].map((m) => m[1]);
    expect(blocks.length).toBeGreaterThanOrEqual(3);
    const print = blocks.join('\n');
    expect(print).toMatch(/\.skip-link\s*\{[^}]*display:\s*none/);
    expect(print).toMatch(/break-inside:\s*avoid/);
    // Forcing `body` alone is not enough — cards and sections paint their own surfaces
    // through utility classes, which is how headings printed black-on-black. The surfaces
    // must be inverted AND the text forced, or the PDF is unreadable either way.
    expect(print).toMatch(/background:\s*#fff\s*!important/);
    expect(print).toMatch(/\.shell-content/);
    expect(print).toMatch(/\[class\*='bg_var\(--atelier/);
    expect(print).toMatch(/h1,[\s\S]{0,200}color:\s*#111\s*!important/);
  });

  test('reduced motion neutralises every transition, not three class names', async () => {
    // The block used to kill three animations BY NAME, so anything added without one of
    // those names was unprotected by construction — 33 tag chips still moved under reduce.
    const css = await read('apps/astro/src/index.css');
    const start = css.indexOf('@media (prefers-reduced-motion');
    expect(start).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf('\n}', start));
    expect(block).toMatch(/\*,\s*\n\s*\*::before,\s*\n\s*\*::after\s*\{/);
    expect(block).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(block).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
  });

  test('the footer is capped to the content width', async () => {
    // Full-bleed against a capped `.page-shell` put the footer 488px outboard at 2560.
    const css = await read('apps/astro/src/index.css');
    const footer = css.slice(css.indexOf('.shell-footer {'));
    expect(footer.slice(0, 400)).toMatch(/max-width:\s*var\(--sizes-breakpoint-xl/);
    expect(footer.slice(0, 400)).toMatch(/margin-inline:\s*auto/);
  });

  test('every card title/year row survives an unbreakable title', async () => {
    // A flex item defaults to `min-width: auto`, so an unbreakable Japanese title sets the
    // row's min-content and pushes the year out of the card — or off a 320px viewport.
    const source = await read('apps/astro/src/pages/[locale]/projects/index.astro');
    // Anchor on the year label and look back at the row that contains it, rather than
    // matching one `<Flex>` spelling — the two rows do not share their other attributes.
    const yearSites = [...source.matchAll(/\{yearLabel\(project\.date/g)];
    expect(yearSites.length).toBeGreaterThanOrEqual(2);
    for (const site of yearSites) {
      // A fixed lookback rather than the nearest `<Flex`: the three rows protect themselves
      // on different elements (Heading/Text, Stack/Flex), and only the pairing matters.
      const row = source.slice(Math.max(0, site.index! - 1600), site.index!);
      expect(row).toMatch(/minW="0"/);
      expect(row).toMatch(/flexShrink="0"/);
    }
  });
});
