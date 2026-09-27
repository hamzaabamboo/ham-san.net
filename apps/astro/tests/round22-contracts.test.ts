import { describe, expect, test } from 'bun:test';

const read = (path: string) => Bun.file(path).text();

// Comments name the tokens they explain, so a guard that matches raw source matches its own
// rationale. Strip them first.
const stripComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const EVENTS_CSS = 'apps/astro/src/styles/events-report.css';
const EVENTS_PAGE = 'apps/astro/src/pages/[locale]/events/index.astro';

describe('amber is a signal, not an ink', () => {
  test('no chart value on /events is set in the accent colour', async () => {
    // 213 amber text nodes on one page is not a signal — it is the page's body colour, and
    // the reader has nothing left to look at.
    const css = stripComments(await read(EVENTS_CSS));
    const amberStrong = [...css.matchAll(/([^}]*strong[^{]*)\{([^}]*)\}/g)].filter(([, , body]) =>
      /color:\s*var\(--atelier-accent[\w-]*\)/.test(body)
    );
    expect(amberStrong.map(([, selector]) => selector.trim())).toEqual([]);
  });

  test('no decorative left rule is amber outside an interactive state', async () => {
    for (const path of [EVENTS_CSS, 'apps/astro/src/index.css']) {
      const css = stripComments(await read(path));
      const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(
        ([, selector, body]) =>
          /border-left:[^;]*var\(--atelier-accent[\w-]*\)/.test(body) &&
          !/:hover|:focus|\[aria-current|\[data-active/.test(selector)
      );
      expect(rules.map(([, selector]) => `${path} ${selector.trim()}`)).toEqual([]);
    }
  });

  test('a passive nav state does not take a solid amber fill', async () => {
    // The active sidebar row was a solid 254x48 amber block — the loudest element on every
    // page, for a state the horizontal nav already marks with an amber underline.
    const css = stripComments(await read('apps/astro/src/index.css'));
    const active = css.slice(css.indexOf(".shell-sidebar-link[aria-current='page']"));
    expect(active.slice(0, 260)).not.toMatch(/background-color:\s*var\(--atelier-accent\)/);
    expect(active.slice(0, 260)).toContain('border-left: 4px solid var(--atelier-accent)');
  });

  test('the hobby monograms are not amber', async () => {
    const source = await read('apps/astro/src/pages/[locale]/hobbies/index.astro');
    const glyph = source.slice(source.indexOf('fontSize="76px"'));
    expect(glyph.slice(0, 200)).not.toContain('--atelier-accent');
  });
});

describe('the one amber leader marks the leading value', () => {
  test('no leader is selected by DOM position', async () => {
    // `:first-of-type` is the leader only in a list sorted descending. The weekday and
    // month-of-year charts are in calendar order, and the attendance table's first row is
    // its header, which has no bar to paint.
    const css = stripComments(await read(EVENTS_CSS));
    const positional = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(
      ([, selector, body]) =>
        /:first-(child|of-type)\s+i\b/.test(selector) && /var\(--atelier-accent\)/.test(body)
    );
    expect(positional.map(([, selector]) => selector.trim())).toEqual([]);
    expect(css).toContain('[data-leader] i');
  });

  test('every chart marks its leader from the data', async () => {
    const page = await read(EVENTS_PAGE);
    // The calendar-ordered charts compare against the computed maximum; the ranked lists,
    // which are sorted descending, may use index 0.
    // `|| undefined` is load-bearing: Astro renders `data-leader={false}` as the ATTRIBUTE
    // `data-leader="false"`, which `[data-leader]` matches, so every bar went amber.
    expect(page).toContain('data-leader={day.count === maxWeekdayCount || undefined}');
    expect(page).toContain('data-leader={month.count === maxMonthOfYearCount || undefined}');
    expect(page.match(/data-leader=\{index === 0 \|\| undefined\}/g) ?? []).toHaveLength(5);
    expect(page).not.toMatch(/data-leader=\{(?![^}]*\|\| undefined)/);
    // A `<details>` continuation list restarts at 1, so index 0 there is rank 11, not a leader.
    const continuations = [...page.matchAll(/start=\{rankListVisible \+ 1\}([\s\S]*?)<\/ol>/g)];
    expect(continuations).toHaveLength(2);
    for (const [, body] of continuations) expect(body).not.toContain('data-leader');
  });
});

describe('one page-name scale, one section-heading specimen', () => {
  const INDEX_PAGES = [
    'index',
    'projects/index',
    'notes/index',
    'hobbies/index',
    'tags/index',
    'about/index',
    'contact/index'
  ];

  test('every page-name h1 uses the same desktop step', async () => {
    // Eight routes each hand-rolled a size: 48 / 72 / 96 / 115px for one role.
    for (const page of INDEX_PAGES) {
      const file = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      // Four of these now render the h1 from the shared masthead, which owns the scale.
      const source = file.includes('<PageMasthead')
        ? await read('apps/astro/src/components/common/PageMasthead.astro')
        : file;
      const h1 = source.slice(source.indexOf('as="h1"'));
      const size = h1.match(/fontSize=\{\{([^}]*)\}\}/)?.[1] ?? '';
      // The home hero is a sentence, not a page name, so it keeps its own smaller step.
      expect(`${page} ${size.replace(/\s+/g, ' ').trim()}`).toBe(
        page === 'index'
          ? "index base: '5xl', md: '5xl', lg: '5xl'"
          : `${page} base: '5xl', md: '7xl'`
      );
    }
  });

  test('every empty-state heading uses the section specimen', async () => {
    // The unification pass covered the success paths and left the degraded ones a step down.
    for (const page of ['notes/index', 'projects/index', 'hobbies/index']) {
      const source = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      const empty = source.slice(source.indexOf('empty-title'));
      const heading = source.slice(0, source.indexOf('empty-title')).lastIndexOf('as="h2"');
      expect(`${page} ${source.slice(heading, heading + 60).match(/base: '(\w+)'/)?.[1]}`).toBe(
        `${page} 3xl`
      );
      expect(empty.length).toBeGreaterThan(0);
    }
  });

  test('no section heading is set in the UI sans', async () => {
    // `/projects` set ACTIVE/INACTIVE in Manrope extrabold caps while every other route used
    // the Newsreader specimen, so the same role read as two different sites.
    const source = await read('apps/astro/src/pages/[locale]/projects/index.astro');
    const headings = [...source.matchAll(/as="h2"[\s\S]{0,240}?>/g)].map(([match]) => match);
    expect(headings.length).toBeGreaterThan(0);
    for (const heading of headings) expect(heading).not.toContain('var(--font-body)');
  });
});

describe('one left edge', () => {
  test('the nav, the content and the footer all derive from one inset', async () => {
    // Measured before this: brand 32px outboard and footer 24px inboard of the content
    // column, constant at 1024/1440/1920/2560 — three structural edges, three values.
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toContain('--content-inset: 2rem;');
    // Anchored on the declaration itself, not on an offset from the first 1024px media
    // query — adding another such query ahead of it silently moved the window.
    const navBlocks = [...css.matchAll(/\.shell-nav \{[^}]*\}/g)].map(([block]) => block);
    const padded = navBlocks.filter((block) => block.includes('padding-left'));
    expect(padded).toHaveLength(1);
    expect(padded[0]).toContain('16rem + var(--content-inset)');
    expect(css).toMatch(/\.shell-footer\s*\{\s*padding-inline: var\(--content-inset\)/);
  });
});

describe('columns earn their width', () => {
  test('the note contents rail only takes a column when it has entries to show', async () => {
    // Measured before: a 540px article between a 220px rail holding ONE entry (the note's
    // own title) and a 280px rail, on a 3405px page.
    const page = await read('apps/astro/src/pages/[locale]/notes/[...slug]/index.astro');
    expect(page).toContain('const showContents = headings.length >= CONTENTS_MIN_ENTRIES;');
    // The name alone is satisfied by `= 0`, which restores the one-entry rail on every note.
    expect(page).toMatch(/CONTENTS_MIN_ENTRIES = ([2-9]\d*)/);
    expect(page).toContain('data-contents={showContents || undefined}');
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/\.note-layout\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\);/);
    expect(css).toMatch(/\.note-layout\[data-contents\]\s*\{\s*grid-template-columns: 200px/);
  });

  test('the contact social links are left-aligned and flow across the page', async () => {
    // Park-UI's Link centres its children, so every label sat centred on an otherwise
    // strictly left-aligned site, in a 268px column that ended 800px above the page bottom.
    const page = await read('apps/astro/src/pages/[locale]/contact/index.astro');
    expect(page).toContain('alignItems="flex-start"');
    // auto-fit + a min() floor: auto-fill resolved to 4 columns for 6 items, leaving row
    // two as two cards beside a 560px hole.
    expect(page).toContain('repeat(auto-fit, minmax(min(100%, 320px), 1fr))');
    // The form header was the only filled bar on the site and read as a table header.
    expect(page).not.toMatch(/bg="var\(--atelier-surface-highest\)"[\s\S]{0,200}form-heading/);
  });
});

describe('round 23 design fixes', () => {
  test('the hobby plates carry no accent', async () => {
    // The glyphs were greyed in round 22 but the TILES were not: 53 amber gradient stops in
    // `::before`/`::after`, invisible to a `getComputedStyle(element)` probe, painting the
    // largest accent surface on the site down the whole page.
    const page = await read('apps/astro/src/pages/[locale]/hobbies/index.astro');
    const visual = page.slice(page.indexOf('const hobbyVisual = css({'));
    const block = visual.slice(0, visual.indexOf('\n});'));
    expect(block.match(/rgba\(255, (?:176, 0|213, 151)/g) ?? []).toEqual([]);
  });

  test('every page title starts on the content edge', async () => {
    // The header rule used to sit inside the content box, so each page carrying one pushed
    // its own h1 right by the rule plus its padding — five different title left edges.
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/\.page-header-rule\s*\{[^}]*margin-left: calc\(-1\.5rem - 2px\)/);
    for (const page of ['notes/index', 'tags/index', 'contact/index', 'about/index']) {
      const file = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      // The rule lives inside the shared masthead for the pages that use it.
      const source = file.includes('<PageMasthead')
        ? await read('apps/astro/src/components/common/PageMasthead.astro')
        : file;
      const header = source.slice(0, source.indexOf('as="h1"'));
      expect(`${page} ${/borderLeft/.test(header)}`).toBe(`${page} false`);
      expect(source).toContain('className="page-header-rule"');
    }
  });

  test('no selected state takes a solid accent fill', async () => {
    // The `/events` year chip kept the exact pattern the sidebar was demoted from.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const active = css.slice(css.indexOf("a[data-active='true']"));
    expect(active.slice(0, 200)).not.toMatch(/background: var\(--atelier-accent\)/);
  });

  test('no face is ever synthetically obliqued', async () => {
    // The per-locale italic suppression is keyed to the DOCUMENT lang, so Thai and Japanese
    // CMS text inside an `lang="en"` page still got a faux oblique.
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/font-synthesis(-style)?: none/);
  });
});

describe('round 24: nothing renders as an unfinished page', () => {
  test('a hobby with no body and no children still gets a real state', async () => {
    // Six of twelve hobby detail pages rendered an h1, one sentence, then ~370px of nothing
    // to the footer. The emptiness is in the CMS, but the blank page was the template's.
    const page = await read('apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro');
    // Whitespace-tolerant: prettier wraps this condition across three lines.
    expect(page.replace(/\s+/g, ' ')).toContain(
      'bodyParts.length === 0 && childDocuments.length === 0 && !childDocumentsUnavailable'
    );
  });

  test('the hobby detail plate carries no accent either', async () => {
    // The round-23 sweep greyed the index tiles and left the detail hero's own copy of them.
    const styles = await read('apps/astro/src/components/hobbies/hobbyStyles.tsx');
    const visual = styles.slice(styles.indexOf('detailVisual: css({'));
    const block = visual.slice(0, visual.indexOf('detailBody'));
    expect(block.match(/rgba\(255, (?:176, 0|213, 151)/g) ?? []).toEqual([]);
    expect(block).not.toContain("borderLeft: '4px solid var(--atelier-accent)'");
  });

  test('the homepage hero does not render a CMS illustration', async () => {
    // The asset in place is stock clip art on a white ground: in a grayscale-plus-amber
    // system it was the brightest block on the page and beat the amber CTA beside it.
    // Comments stripped first: the note explaining the removal names the field it removed.
    const page = stripComments(await read('apps/astro/src/pages/[locale]/index.astro'));
    const hero = page.slice(0, page.indexOf('<StatusRow'));
    const images = hero.match(/<img[^>]*>/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) expect(image).toContain('data-kameko-image');
    expect(hero).not.toContain('introductionImage');
  });

  test('a note card anchors its meta line to the bottom', async () => {
    // Cards were height-matched per row but their content was not, leaving 90-130px dead at
    // the bottom of every card whose neighbour had a longer excerpt.
    const page = await read('apps/astro/src/pages/[locale]/notes/index.astro');
    expect(page).toContain('<Stack gap={3} h="full">');
    expect(page).toMatch(/fontFamily="var\(--font-code\)"\s*\n\s*mt="auto"/);
  });

  test('the mobile attendance table does not scroll a wider table inside a card', async () => {
    // A 30rem row inside a 324px card sliced its own values mid-glyph at the card edge.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const mobile = css.slice(css.indexOf('@media (max-width: 520px)'));
    expect(mobile.slice(0, 600)).toContain('min-width: 0');
  });

  test('the sidebar locale card does not outrank the active page', async () => {
    const css = stripComments(await read('apps/astro/src/index.css'));
    const env = css.slice(css.indexOf('.shell-sidebar-env {'));
    expect(env.slice(0, 160)).not.toContain('var(--atelier-surface-highest)');
  });
});

describe('round 25: composition', () => {
  test('the empty hobby state does not echo its own hero sentence', async () => {
    // The panel repeated the hero subtitle verbatim 190px lower in the same face, which
    // made the new empty state read as an unfiltered dump.
    const page = await read('apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro');
    expect(page.match(/hobbies\.overview-empty-page/g) ?? []).toEqual([]);
  });

  test('the homepage holds one left edge for its whole length', async () => {
    // The hero sat on 288 while every section below it sat on 312 and the status labels on
    // 344, under a rule that began at 288 — the landing page was the one misaligned route.
    const page = await read('apps/astro/src/pages/[locale]/index.astro');
    expect(page).not.toContain("px={{ base: '0', lg: '6' }}");
    const status = await read('apps/astro/src/components/home/StatusRow.astro');
    expect(status).not.toMatch(
      /<Stack\s+p=\{\{ base: '5', sm: '8' \}\}\s+gap="3"\s+minW="0"\s+borderRight/
    );
  });

  test('hobby detail sits on the same gutter as every other route', async () => {
    const styles = await read('apps/astro/src/components/hobbies/hobbyStyles.tsx');
    expect(styles).toContain("px: { base: '4', md: '8' }");
    // The headline rule hangs in the gutter so the h1 lands on the content edge.
    expect(styles).toContain("ml: 'calc(-1.5rem - 4px)'");
  });

  test('the about column is not a card inside a card', async () => {
    // A 2px frame wrapped two 1px-framed blocks, one carrying a third inset border.
    const page = await read('apps/astro/src/pages/[locale]/about/index.astro');
    expect(page).not.toContain('className="blocky-shadow"\n            p="6"');
    expect(page).not.toContain('rgba(255, 176, 0, 0.35)');
  });

  test('the events hero opens with its own title', async () => {
    // `align-content: end` on a 19rem column left a ~700x220px hole above the page title.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const hero = css.slice(css.indexOf('.event-report__hero-copy'));
    expect(hero.slice(0, 160)).toContain('align-content: start');
    expect(hero.slice(0, 160)).not.toContain('min-height: 19rem');
  });

  test('stat strips stay three-up on mobile', async () => {
    // Stacking turned a 3-cell strip into three ~110px bands each holding one short number
    // beside 250px of nothing.
    for (const page of ['projects/index', 'notes/index']) {
      const source = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      expect(`${page} ${source.includes("base: 'repeat(3, minmax(0, 1fr))'")}`).toBe(
        `${page} true`
      );
    }
  });

  test('the stacked hero CTAs share one right edge', async () => {
    const css = stripComments(await read('apps/astro/src/index.css'));
    const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
    expect(mobile.slice(0, 200)).toContain('.home-hero-cta');
  });
});

describe('round 26', () => {
  test('no background shorthand carries two bare colours', async () => {
    // `background: var(--x), var(--x)` is invalid, so the whole declaration is dropped and
    // the element computes to transparent. It made the featured note card LESS elevated
    // than the ordinary cards below it, inverting the page's one hierarchy — and no
    // source-reading guard would catch it, only the computed value.
    for (const file of ['apps/astro/src/index.css', 'apps/astro/src/styles/events-report.css']) {
      const css = stripComments(await read(file));
      const doubled = [...css.matchAll(/background:\s*var\(--[\w-]+\)\s*,\s*var\(--[\w-]+\)\s*;/g)];
      expect(doubled.map((m) => `${file}: ${m[0]}`)).toEqual([]);
    }
  });

  test('the archive ribbon does not push a card off its row baseline', async () => {
    // Stacked above the media it added a 33px band, so a five-across row showed three
    // different title baselines. The meta row also reserves two lines, because a longer
    // category wraps in a narrow column and a shorter one does not.
    const card = await read('apps/astro/src/components/projects/ProjectCard.tsx');
    const ribbon = card.slice(card.indexOf('card-archive') - 900, card.indexOf('card-archive'));
    expect(ribbon).toContain('position="absolute"');
    expect(card).toContain('minH="2.4rem"');
  });

  test('markdown body links are not set in the accent colour', async () => {
    // Twenty amber bold links in one body reads as highlighter and spends the system's one
    // signal colour on prose.
    const md = await read('apps/astro/src/components/lib/Markdown.tsx');
    const link = md.slice(md.indexOf('const isExternal'), md.indexOf('hr: ('));
    expect(link).not.toContain('color="var(--atelier-accent-soft)"');
    expect(link).toContain('color="var(--atelier-fg)"');
  });

  test('the small tag categories share rows', async () => {
    // Seven identical near-empty full-width bands, one of them holding two chips.
    const page = await read('apps/astro/src/pages/[locale]/tags/index.astro');
    const secondary = page.slice(page.indexOf('secondaryGroups).map') - 400);
    expect(secondary.slice(0, 400)).toContain("md: 'repeat(2, minmax(0, 1fr))'");
  });

  test('the 404 sits on the same spine as every other page', async () => {
    const page = await read('apps/astro/src/pages/404.astro');
    expect(page).not.toContain('textAlign="center"');
    expect(page).not.toContain('justifyContent="center"');
  });
});

describe('round 27', () => {
  test('the distribution bar fill matches the value printed beside it', async () => {
    // Round 27 used a sqrt scale to stop the tail collapsing onto the minimum bar width.
    // Round 29 then drew the bars inside a full-width track, which turns the row into a
    // 0-100% axis — and a non-linear fill against an absolute label makes every bar
    // contradict its own number. Linear fill, with a minimum stub in CSS for the tail.
    const page = await read('apps/astro/src/pages/[locale]/events/index.astro');
    expect(page).toContain('size: (item.count / maxCount) * 100');
    expect(page).not.toContain('Math.sqrt');
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const bar = css.slice(css.indexOf('.event-report__rank-list i {'));
    expect(bar.slice(0, 360)).toContain('max(var(--size, 0%), 3px)');
  });

  test('the project article measure is deliberate, not a left-shoved column', async () => {
    // Prose capped at 70ch with the link cards above it at full container width left a dead
    // right third. The links now occupy that column.
    const page = await read('apps/astro/src/pages/[locale]/projects/[slug]/index.astro');
    // The split must sit at a width where 70ch + the 280px rail actually fits: at `lg`
    // (1024) the prose track was squeezed to ~295px, about 33 characters per line.
    expect(page).toContain("xl: 'minmax(0, 70ch) 280px'");
    // And the single-column state has to carry the measure itself, or 900-1280 runs to 88ch.
    expect(page).toContain("base: 'minmax(0, 70ch)'");
    expect(page).not.toMatch(/<Box maxW="70ch">/);
  });

  test('only one navigation is on screen at any width', async () => {
    // The bar and the rail both listed the same six destinations from 1024 up. The bar keeps
    // them only in the 900-1023 window, where the rail is not yet shown, so no width loses
    // its navigation.
    const css = stripComments(await read('apps/astro/src/index.css'));
    const rail = css.slice(css.indexOf('.shell-sidebar {'));
    expect(rail.slice(0, 400)).toContain('min-width: 1024px');
    const bar = css.slice(css.indexOf('@media (min-width: 900px)'));
    expect(bar.slice(0, 300)).toMatch(
      /@media \(min-width: 1024px\) \{\s*\.shell-nav-links \{\s*display: none;/
    );
  });
});

describe('round 28', () => {
  test('the featured note card is a step above the ordinary ones', async () => {
    // Round 26 fixed an invalid shorthand by setting `surface-low` — the same surface the
    // ordinary cards already use, so the hierarchy was still invisible, just not transparent.
    const css = stripComments(await read('apps/astro/src/index.css'));
    const feature = css.slice(css.indexOf('.note-feature-card {'));
    expect(feature.slice(0, 120)).toContain('var(--atelier-surface-high)');
  });

  test('the note rails can actually stick', async () => {
    // A stretched grid child is already full height, so `position: sticky` had nothing to
    // travel: the rail scrolled away and left two-thirds of a 2000px page empty.
    const css = stripComments(await read('apps/astro/src/index.css'));
    const layout = css.slice(css.indexOf('.note-layout {'));
    expect(layout.slice(0, 220)).toContain('align-items: start');
  });

  test('the hero photo label is a plain-CSS chip, not caught by the locale letter-spacing exemption', async () => {
    // `[class*='ls_0.']` matches any element carrying a letter-spacing utility and kills its
    // `text-transform` too, so a utility-styled label read HAM on /en and Ham on /ja and /th.
    const page = await read('apps/astro/src/pages/[locale]/index.astro');
    expect(page).toContain('class="home-hero-photo-chip"');
    const css = stripComments(await read('apps/astro/src/styles/home.css'));
    expect(css).toMatch(/\.home-hero-photo-chip \{[^}]*text-transform: uppercase/);
  });

  test('a lone markdown hard-break escape does not reach the page', async () => {
    const md = await read('apps/astro/src/components/lib/Markdown.tsx');
    expect(md).toContain(String.raw`if (/^\\+$/.test(text.trim())) return null;`);
  });

  test('only the largest tag group takes a full-width band', async () => {
    const page = await read('apps/astro/src/pages/[locale]/tags/index.astro');
    expect(page).toContain('const PRIMARY_TYPES = [Enum_Tag_Type.Frontend];');
  });
});

describe('round 29', () => {
  test('the rank bars are drawn against a visible track', async () => {
    // Without the unfilled remainder there is no scale on screen, so a sqrt-compressed bar
    // reads as a linear one and understates the leader.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const bar = css.slice(css.indexOf('.event-report__rank-list i {'));
    expect(bar.slice(0, 320)).toContain('linear-gradient');
    expect(bar.slice(0, 320)).toContain('var(--atelier-surface-high)');
  });

  test('every index masthead comes from one component', async () => {
    // Four sibling pages carried three different eyebrow treatments and two of them had no
    // eyebrow at all.
    for (const page of ['projects/index', 'notes/index', 'hobbies/index', 'tags/index']) {
      const source = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      expect(`${page} ${source.includes('<PageMasthead')}`).toBe(`${page} true`);
      // The old hand-rolled h1 must be gone, not merely joined by the component.
      expect(`${page} ${/<Heading as="h1"/.test(source)}`).toBe(`${page} false`);
    }
  });

  test('the hobby meta chips sit on fixed axes', async () => {
    // A free wrap broke at a different point on every row and pushed an orphan chip onto a
    // second line on five of twelve.
    const page = await read('apps/astro/src/pages/[locale]/hobbies/index.astro');
    expect(page).toContain("md: '7rem 11rem 9rem'");
    // Exactly three slots, with counts merged, so a missing value leaves a gap not a shift.
    expect(page).toContain("countLabels.join(' \\u00B7 ') || null");
  });

  test('the tag detail grid does not render the project card five-up', async () => {
    const page = await read('apps/astro/src/pages/[locale]/tags/[slug]/index.astro');
    expect(page).toContain('minmax(min(100%, 300px), 1fr)');
  });

  test('a short carousel does not carry three navigation affordances', async () => {
    const carousel = await read('apps/astro/src/components/common/Carousel.tsx');
    expect(carousel).toContain('hidden={images.length <= 3}');
    // Static classes: Panda drops a computed gridTemplateColumns and the strip collapses.
    expect(carousel).toContain('thumbnailStripWide : thumbnailStrip');
  });
});

describe('round 30', () => {
  test('every detail rail rests on the same line, clear of the header', async () => {
    // Three rails, three offsets, one of them (24px) behind a 64px fixed header with its
    // top border clipped so the panel appeared to start mid-list.
    const hobby = await read('apps/astro/src/components/hobbies/hobbyStyles.tsx');
    expect(hobby).toContain("top: '24'");
    const note = await read('apps/astro/src/pages/[locale]/notes/[...slug]/index.astro');
    expect(note).not.toContain('top="32"');
    const project = await read('apps/astro/src/pages/[locale]/projects/[slug]/index.astro');
    expect(project).toContain("top={{ xl: '24' }}");
  });

  test('the thumbnail strip is a row at every width', async () => {
    // A fixed 160px track inside a 308px container resolves to one column, so the strip
    // stacked and stood 504px tall against a 195px slide.
    const carousel = await read('apps/astro/src/components/common/Carousel.tsx');
    expect(carousel).toContain("gridAutoFlow: 'column'");
    expect(carousel).toContain("overflowX: 'auto'");
  });

  test('the archive list announces itself', async () => {
    // The inactive section switched from 3-up cards to a bare list after nine items with no
    // heading, so the format break read as a rendering fault.
    const page = await read('apps/astro/src/pages/[locale]/projects/index.astro');
    expect(page).toContain("t('project.earlier-work')");
  });

  test('the hobby count chip does not overhang the rule it sits on', async () => {
    const page = await read('apps/astro/src/pages/[locale]/hobbies/index.astro');
    expect(page).toContain("'& > *:last-child': { justifySelf: 'end' }");
  });
});

describe('round 31', () => {
  test('every page eyebrow comes from one chip', async () => {
    // Four detail pages carried four treatments — a chip, plain small-caps, an indented
    // amber rule and a status word — while /contact had none and its peer /about did.
    for (const page of [
      'notes/[...slug]/index',
      'projects/[slug]/index',
      'tags/[slug]/index',
      'contact/index'
    ]) {
      const source = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      expect(`${page} ${source.includes('<Eyebrow ')}`).toBe(`${page} true`);
    }
    // And the masthead composes the same chip, so there is one definition of it.
    const masthead = await read('apps/astro/src/components/common/PageMasthead.astro');
    expect(masthead).toContain('<Eyebrow label={eyebrow} />');
  });

  test('an odd tag group is not orphaned in a half column', async () => {
    const page = await read('apps/astro/src/pages/[locale]/tags/index.astro');
    expect(page).toContain("'&:last-child:nth-child(odd)': { gridColumn: '1 / -1' }");
  });

  test('inactive project cards pin their chip row', async () => {
    // Equal-height cards with top-flowed content put three chip rows in one row at three
    // heights, while every other card family on the site pins its bottom row.
    const page = await read('apps/astro/src/pages/[locale]/projects/index.astro');
    expect(page).toContain('<Wrap gap="2" mb="4" mt="auto">');
  });

  test('the about closing quote is not a footnote to the last job', async () => {
    // It sat inside the Experience column under that column's rule, with the left rail
    // ending ~230px above it.
    const page = await read('apps/astro/src/pages/[locale]/about/index.astro');
    const grid = page.indexOf('</Grid>');
    expect(page.indexOf("t('about-me.bio-integrity')")).toBeGreaterThan(grid);
  });
});

describe('round 32', () => {
  test('no card composes centre-out', async () => {
    // Park-UI's Link sets `align-items: center`. Making the inactive card a flex column to
    // pin its chip row inherited that and centred every line — title, year, description and
    // chips — directly under a left-aligned Active grid. Second time this trap has bitten.
    // Comments stripped first: the note explaining this names the very prop it protects.
    const page = stripComments(await read('apps/astro/src/pages/[locale]/projects/index.astro'));
    const card = page.slice(page.indexOf('inactiveGridProjects.map'));
    expect(card.slice(0, 700)).toContain('alignItems="stretch"');
  });

  test('the hobby detail eyebrow is the shared chip too', async () => {
    const page = await read('apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro');
    expect(page).toContain('<Eyebrow label=');
    expect(page).not.toContain('hobbyStyles.detailEyebrow');
  });

  test('the about closing rule spans the container', async () => {
    // `maxW` on the Stack put the border 224px short of the cards above and the strip below.
    const page = await read('apps/astro/src/pages/[locale]/about/index.astro');
    const quote = page.slice(page.indexOf('borderTop="1px solid"', page.indexOf('</Grid>')));
    expect(quote.slice(0, 120)).not.toContain('maxW');
  });

  test('the hobby hero panel and the rail share one column track', async () => {
    // 7fr/5fr above and 8fr/4fr below put the two right-hand boxes 75px apart.
    const styles = await read('apps/astro/src/components/hobbies/hobbyStyles.tsx');
    expect(styles.match(/md: 'minmax\(0, 1fr\) 22rem'/g) ?? []).toHaveLength(3);
  });

  test('the tag detail experience section is labelled and measured', async () => {
    const page = await read('apps/astro/src/pages/[locale]/tags/[slug]/index.astro');
    expect(page).toContain("t('common.experiences')");
    expect(page).toContain('<Box maxW="70ch">');
  });
});

describe('round 33', () => {
  test('the spark leader is painted', async () => {
    // A spark encodes value as HEIGHT and emits `--size` unitless for the height calc, so
    // the horizontal-track gradient added in round 29 was an invalid value on it. An invalid
    // `background` falls back to the initial value, not to the graphite rule, so the one bar
    // meant to be amber was the only invisible bar on the page.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    expect(css).toMatch(
      /\.event-report__spark\[data-leader\] i \{\s*background: var\(--atelier-accent\)/
    );
  });

  test('the masthead rule does not double the sidebar border', async () => {
    // Two parallel strokes 6px apart in the same colour read as mis-registration.
    const css = stripComments(await read('apps/astro/src/index.css'));
    const suppressed = css.slice(css.indexOf('.page-header-rule'));
    expect(suppressed.slice(0, 400)).toContain('border-left-color: transparent');
  });

  test('Thai underlines clear the lower zone', async () => {
    // A Latin-tuned 4px offset lands on Thai below-vowels and descenders, and `skip-ink`
    // cannot rescue a mark that sits on the line.
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/html:lang\(th\)[^{]*\{\s*text-underline-offset: 0\.28em/);
  });

  test('the accent does not mark a missing thumbnail', async () => {
    // The amber bar lived in the no-image branch, so in a mixed row the eye went to the one
    // card with no artwork.
    const card = await read('apps/astro/src/components/projects/ProjectCard.tsx');
    const fallback = card.slice(card.indexOf('fallback-grid-lines'));
    expect(fallback.slice(0, 1200)).not.toMatch(/bg="var\(--atelier-accent\)"/);
  });

  test('the home page uses one section-header idiom', async () => {
    // A full-width underline on Featured projects against an inline rule on Life — two forms
    // on one page, and the inline rule is the sitewide one.
    const page = await read('apps/astro/src/pages/[locale]/index.astro');
    const headers = page.slice(page.indexOf('<StatusRow'));
    expect(headers).not.toMatch(/borderBottom="1px solid"[\s\S]{0,120}as="h2"/);
    expect(headers).not.toMatch(/borderBottom="1px solid"[\s\S]{0,120}as="h2"/);
    // Round 34 moved the rule into `SectionHeading`, so counting the literal element would
    // now pass only by accident. Assert the component — the stronger contract.
    expect((headers.match(/<SectionHeading /g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});

describe('round 34: one section-header vocabulary', () => {
  test('no page hand-rolls a section rule', async () => {
    // The section-header form was invented five times across the pages — an inline rule, a
    // full-width underline, a Wrap with a glyph, a bare heading. One component now owns it,
    // which is the actual fix: the earlier rounds unified the LOOK page by page and the
    // vocabulary drifted again each time a section was added.
    const glob = new Bun.Glob('**/*.astro');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src/pages' })) {
      scanned++;
      const source = await read(`apps/astro/src/pages/${file}`);
      // A SECTION rule specifically: it stretches. A plain 1px divider inside a card is a
      // different thing and stays.
      for (const match of source.matchAll(
        /<Box h="1px"[^/]*(?:flex="1"|w="full")[^/]*bg="var\(--atelier-line\)"/g
      )) {
        offenders.push(`${file}: ${match[0].slice(0, 50)}`);
      }
    }
    expect(scanned).toBeGreaterThan(8);
    expect(offenders).toEqual([]);
  });

  test('the shared heading is what the pages use', async () => {
    for (const page of [
      'index',
      'projects/index',
      'about/index',
      'contact/index',
      'tags/[slug]/index'
    ]) {
      const source = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      expect(`${page} ${source.includes('<SectionHeading ')}`).toBe(`${page} true`);
    }
  });
});

describe('round 35', () => {
  test('/events uses the shared section heading like every other page', async () => {
    // The unification skipped a whole page: all seven `/events` headers kept a LEADING 2px
    // bar with no trailing rule, so the header form visibly flipped when moving between
    // top-level nav pages — and flipped seven times on that one page.
    const page = await read('apps/astro/src/pages/[locale]/events/index.astro');
    expect((page.match(/<SectionHeading /g) ?? []).length).toBe(7);
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    expect(css).not.toContain('.event-report__section-head');
  });

  test('the section heading has no one-off variants', async () => {
    // The optional `icon` prop was used exactly once, on a label that renders bare on
    // another page — the same inconsistency the component was extracted to remove,
    // surviving inside the component.
    const component = await read('apps/astro/src/components/common/SectionHeading.astro');
    expect(component).not.toContain('icon');
    const about = await read('apps/astro/src/pages/[locale]/about/index.astro');
    expect(about).not.toMatch(/<SectionHeading[^/]*icon=/);
  });

  test('a panel header sits on the shared type step', async () => {
    // Panel headers keep their own frame — the panel border draws the line, so they take no
    // stretching rule — but the type step is the same one every section heading uses.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const panel = css.slice(css.indexOf('.event-report__highlight-head h2'));
    expect(panel.slice(0, 160)).toContain('clamp(1.875rem, 3vw, 2.25rem)');
  });

  test('a card with no external links keeps its CTA on the row baseline', async () => {
    // The icon row is a sibling below the link stack; when it collapsed the stack absorbed
    // the slack and the bottom-pinned CTA dropped ~32px below its neighbours.
    const card = await read('apps/astro/src/components/projects/ProjectCard.tsx');
    // Order-independent: prettier reorders props, so pinning their sequence is brittle.
    const footer = card.slice(card.lastIndexOf('</Link>'));
    expect(footer).toContain('minH="3rem"');
  });
});

describe('round 36', () => {
  test('overview stat values align by construction, not by a reserved height', async () => {
    // With `align-content: start` the value row began wherever the label ended, so the one
    // label that wrapped dropped its number 21px below its neighbours — the same failure the
    // project cards had when their icon row collapsed. A `min-height` reservation only holds
    // until a label wraps to one more line than the guess: two lines still broke by 22px at
    // 1180. `subgrid` shares the parent's row tracks, so it cannot break at any width.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const article = css.slice(css.indexOf('.event-report__overview-grid article'));
    expect(article.slice(0, 240)).toContain('grid-template-rows: subgrid');
    expect(article.slice(0, 240)).toContain('grid-row: span 3');
  });
});

describe('round 39: multi-lens sweep', () => {
  test('taxonomy is read from one locale, not per-locale', async () => {
    // `cmsLocale` was used as if it were a content-availability map: the ja tag entities
    // carry no `projects`/`experiences` relations, so /ja/tags rendered 4 chips all (0)
    // against 33 with real counts on en and th — contradicted by /ja/tags/<slug> itself.
    const page = await read('apps/astro/src/pages/[locale]/tags/index.astro');
    expect(page).toContain("withLastGood('about:en'");
    expect(page).not.toMatch(/cmsLocale/);
  });

  test('the about lede is the authored line on every locale', async () => {
    // The CMS `introduction` is resume boilerplate that reads boastful against this voice,
    // and it surfaced on /en alone because ja's is null and th never took the branch.
    const page = await read('apps/astro/src/pages/[locale]/about/index.astro');
    expect(page).not.toContain('aboutMe?.introduction');
  });

  test('both note rails are sticky grid children', async () => {
    // Nested inside a static Stack of equal height the CONTENTS rail had zero travel, so it
    // scrolled away while the DETAILS rail on the same page stayed pinned.
    const page = await read('apps/astro/src/pages/[locale]/notes/[...slug]/index.astro');
    expect(page).toMatch(/hideBelow="xl"[^>]*position="sticky"/);
  });

  test('events anchors clear the fixed nav', async () => {
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    expect(css).toContain('scroll-margin-top: 5.5rem');
    expect(css).not.toContain('scroll-margin-top: 1rem');
  });

  test('the mobile rank row keeps its value on the name line', async () => {
    // The value column resolved to 0px and the percentage fell to a third row under the bar,
    // taking every one of 120 rows from 47px to 87px.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    expect(css).toMatch(/\.event-report__rank-list li > strong \{\s*grid-area: 1 \/ 2;/);
  });

  test('the badge size variants are actually emitted', async () => {
    // `size` is passed as a variable, so panda emitted the default variant only and
    // `.badge--size_sm` matched no rule at all — zero padding at the inherited 14px.
    const config = await read('apps/astro/panda.config.ts');
    expect(config).toMatch(/badge: \[\{ size: \['sm', 'md'\], variant: \['outline'\] \}\]/);
  });

  test('the ja font request does not pay for an unused weight', async () => {
    // Each weight of Noto Sans JP is ~30 KB gz across ~124 subsets. Weight 500 had a single
    // consumer (`.shell-nav-link`). A `400..700` variable range is NOT smaller — measured
    // 122,356 B against 91,937 — because subset count dominates, not the weight axis.
    const fonts = await read('apps/astro/src/utils/fonts.ts');
    expect(fonts).toContain('Noto+Sans+JP:wght@400;700');
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).not.toMatch(/\.shell-nav-link[^}]*font-weight: 500/);
  });

  test('the mobile drawer exposes the current page and locale', async () => {
    // Below 900px the drawer is the ONLY navigation, and it carried `data-active` alone.
    const sidebar = await read('apps/astro/src/components/layout/Sidebar.tsx');
    expect(sidebar).toContain("aria-current={isCurrent ? 'page' : undefined}");
    expect(sidebar).toContain("aria-current={code === locale ? 'true' : undefined}");
  });

  test('the carousel region is named', async () => {
    // ARIA requires a name alongside `aria-roledescription`; an unnamed region also drops
    // out of the landmark list.
    const carousel = await read('apps/astro/src/components/common/Carousel.tsx');
    expect(carousel).toMatch(/aria-label=\{slideLabel\}/);
  });
});

describe('round 40', () => {
  test('the note contents rail marks the section actually in view', async () => {
    // `idx === 0` hardcoded the accent onto the first entry, so on a 28,000px note the rail
    // claimed section 1 while the reader was eleven sections down — and nothing carried
    // `aria-current`, so it was invisible to assistive tech either way.
    const page = await read('apps/astro/src/pages/[locale]/notes/[...slug]/index.astro');
    expect(page).not.toMatch(/idx === 0 \? 'var\(--atelier-accent\)'/);
    expect(page).toContain("link.setAttribute('aria-current', 'true')");
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/\.note-toc-link\[aria-current='true'\]/);
  });

  test('the namecard language switcher marks the current locale', async () => {
    // Every other surface marks it; here all three rendered identically.
    const page = await read('apps/astro/src/pages/[locale]/namecard/[variant]/index.astro');
    expect(page).toContain("aria-current={isCurrent ? 'true' : undefined}");
  });

  test('both sidebar eyebrows share one treatment', async () => {
    // "Menu" was an inline style with no `text-transform`, beside an uppercase "LANGUAGE".
    // Reusing the class also inherits the lang(ja)/lang(th) uppercase suppression.
    const sidebar = await read('apps/astro/src/components/layout/DesktopSidebar.astro');
    // Scoped to the header's own element: the footer carries a separate inline style for the
    // locale VALUE, which is a different role and legitimately keeps its own treatment.
    const header = sidebar.slice(
      sidebar.indexOf('shell-sidebar-header'),
      sidebar.indexOf('shell-sidebar-nav')
    );
    expect(header).toContain('class="shell-sidebar-env-label"');
    expect(header).not.toContain('font-family:var(--font-code)');
  });

  test('the skip link lands content clear of the fixed nav', async () => {
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/#main \{\s*scroll-margin-top: 88px;/);
  });
});

describe('round 41', () => {
  test('the corner-notch positioning belongs to the env panel, not the class', async () => {
    // Sharing `.shell-sidebar-env-label` with the header eyebrow for its TYPE also handed it
    // `position: absolute`, which then resolved against `.shell-sidebar` — the label hung at
    // `left: -1px` with its own border off-canvas while its header sat empty.
    const css = stripComments(await read('apps/astro/src/index.css'));
    expect(css).toMatch(/\.shell-sidebar-env > \.shell-sidebar-env-label \{\s*position: absolute;/);
    const base = css.slice(css.indexOf('.shell-sidebar-env-label {'));
    expect(base.slice(0, 200)).not.toContain('position: absolute');
  });

  test('every page hero eyebrow is the shared chip', async () => {
    // `/events` was the last surface with its own: bare amber uppercase text at 0.6875rem
    // against the bordered 10px chip every other hero uses.
    const page = await read('apps/astro/src/pages/[locale]/events/index.astro');
    expect(page).toContain('<Eyebrow label=');
    for (const file of ['apps/astro/src/styles/events-report.css', 'apps/astro/src/index.css']) {
      expect(`${file} ${(await read(file)).includes('event-report__kicker')}`).toBe(
        `${file} false`
      );
    }
  });
});

describe('round 42', () => {
  test('the sidebar eyebrow chip shrinks to its label in both positions', async () => {
    // The notch instance gets shrink-to-fit from `position: absolute`; the header instance is
    // a block in flow, so the same bordered chip stretched the full 207px of the rail beside
    // a 66px one. Measuring only the properties I had changed (transform, size) missed it.
    const css = stripComments(await read('apps/astro/src/index.css'));
    const base = css.slice(css.indexOf('.shell-sidebar-env-label {'));
    expect(base.slice(0, 200)).toContain('width: fit-content');
  });
});

describe('no page hand-rolls the eyebrow chip', () => {
  test('the chip is only ever built inside its own component', async () => {
    // Round 41 replaced the ONE hand-rolled eyebrow it was shown (`/events`) and I reported
    // the vocabulary closed. It was not: `/about` still built its own in grey and `/` in
    // `accent-soft`, so the site carried THREE eyebrow colours for one component. Fixing the
    // instance is not fixing the class — this asserts the class.
    const glob = new Bun.Glob('**/*.astro');
    const offenders: string[] = [];
    let scanned = 0;
    for await (const file of glob.scan({ cwd: 'apps/astro/src/pages' })) {
      scanned++;
      const whole = stripComments(await read(`apps/astro/src/pages/${file}`));
      // The page HERO only — everything above its h1. Chips in body content (the home page's
      // principle row) are a different role, the same way card titles differ from section
      // headings, and are not forced to converge.
      const h1 = whole.indexOf('as="h1"');
      const source = h1 === -1 ? '' : whole.slice(0, h1);
      // The chip's signature: the surface-highest fill with a line border on a small box.
      for (const match of source.matchAll(
        /bg="var\(--atelier-surface-highest\)"[\s\S]{0,320}?fontSize="10px"/g
      )) {
        offenders.push(`${file}: ${match[0].slice(0, 40).replace(/\s+/g, ' ')}`);
      }
    }
    expect(scanned).toBeGreaterThan(8);
    expect(offenders).toEqual([]);
  });

  test('the heroes that carry an eyebrow use the component', async () => {
    for (const page of [
      'index',
      'about/index',
      'projects/index',
      'contact/index',
      'notes/index',
      'hobbies/index',
      'tags/index',
      'events/index'
    ]) {
      const source = await read(`apps/astro/src/pages/[locale]/${page}.astro`);
      // No trailing space in the match: prettier wraps multi-prop JSX onto the next line.
      const usesDirectly = /<Eyebrow[\s/>]/.test(source);
      const usesMasthead = /<PageMasthead[\s/>]/.test(source);
      expect(`${page} ${usesDirectly || usesMasthead}`).toBe(`${page} true`);
    }
  });
});

describe('round 43', () => {
  test('the events hero gutter compensation is not half-overridden at mobile', async () => {
    // The base rule hangs the rail in the gutter with `padding-left: 1.5rem` against
    // `margin-left: calc(-1.5rem - 2px)`. A mobile override changed the padding to 1rem and
    // left the margin, so the pair no longer cancelled: -26 + 16 + 2 = -8. The hero sat 8px
    // left of every section below it on all three locales — broken registration, not a bleed.
    const css = stripComments(await read('apps/astro/src/styles/events-report.css'));
    const mobile = css.slice(css.indexOf('@media (max-width: 520px)'));
    expect(mobile).not.toMatch(/\.event-report__hero \{[^}]*padding-left/);
  });
});

describe('a copy-only change still deploys', () => {
  test('the path filters cover the libraries the site renders from', async () => {
    // All site copy lives in `libs/i18n`. Outside the filter, a copy fix pushes green and
    // silently never ships.
    const source = await read('.github/workflows/deploy.yml');
    const workflow = source.slice(source.indexOf('filters: |'));
    for (const target of ['backend:', 'frontend:']) {
      const block = workflow.slice(workflow.indexOf(target), workflow.indexOf(target) + 400);
      expect(block).toContain("- 'libs/**'");
      expect(block).toContain("- 'package.json'");
    }
  });
});
