import { expect, test } from 'bun:test';

test('drawer overlay is a labeled semantic button', async () => {
  const source = await Bun.file('apps/astro/src/components/layout/Sidebar.tsx').text();
  // Slice to the overlay element before asserting. An unbounded `[\s\S]*?` walks past the
  // element and matches the close button's aria-label ten lines below, so the overlay could
  // ship with no accessible name while this assertion still passed.
  const start = source.indexOf('className="shell-drawer-overlay"');
  expect(start).toBeGreaterThan(-1);
  const overlay = source.slice(start, source.indexOf('/>', start));

  // The drawer's strings arrive as server-resolved props to keep the i18n corpus out of
  // the chunk, so the label's source is a prop rather than a `t()` call.
  expect(overlay).toMatch(/aria-label=\{labels\.menuClose\}/);
  expect(overlay).not.toMatch(/aria-label=(""|\{''\}|\{``\})/);
  // It must stay a real button, not a div with a click handler.
  expect(source.slice(0, start)).toMatch(/<button\s+$/);
});

test('reduced motion disables CSS and Lenis smooth scrolling', async () => {
  const css = await Bun.file('apps/astro/src/index.css').text();
  // Lenis moved out of a React island into MainLayout's deferred module script.
  const layout = await Bun.file('apps/astro/src/layouts/MainLayout.astro').text();

  expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*?scroll-behavior: auto/);
  expect(layout).toContain("matchMedia('(prefers-reduced-motion: reduce)').matches");
  // The import must sit INSIDE the guard block, not merely after it, so reduced-motion
  // users never download Lenis. Ordering alone would pass if the import were hoisted out.
  const guardStart = layout.indexOf(
    "if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {"
  );
  expect(guardStart).toBeGreaterThan(-1);
  let depth = 0;
  let cursor = layout.indexOf('{', guardStart);
  const blockStart = cursor;
  do {
    if (layout[cursor] === '{') depth++;
    else if (layout[cursor] === '}') depth--;
    cursor++;
  } while (depth > 0 && cursor < layout.length);
  expect(layout.slice(blockStart, cursor)).toContain("await import('lenis')");
});

test('contact identity fields expose autocomplete and email spellcheck metadata', async () => {
  const source = await Bun.file('apps/astro/src/pages/[locale]/contact/index.astro').text();

  expect(source).toMatch(/id="contact-name"[\s\S]*?autocomplete="name"/);
  expect(source).toMatch(/id="contact-email"[\s\S]*?autocomplete="email"/);
  expect(source).toMatch(/id="contact-email"[\s\S]*?spellcheck="false"/);
  expect(source).toMatch(/id="contact-subject"[\s\S]*?autocomplete="off"/);
  expect(source).toMatch(/id="contact-message"[\s\S]*?autocomplete="off"/);
});

test('contact controls use focus-visible without duplicate select rules', async () => {
  const css = await Bun.file('apps/astro/src/index.css').text();

  expect(css).toContain('.contact-input:focus-visible');
  expect(css).toContain('.contact-select:focus-visible');
  expect(css.match(/\.contact-select:focus-visible/g)).toHaveLength(1);
});

test('remaining changed card images declare dimensions', async () => {
  const home = await Bun.file('apps/astro/src/pages/[locale]/index.astro').text();
  const projects = await Bun.file('apps/astro/src/pages/[locale]/projects/index.astro').text();

  // Sliced to the element: an unbounded `[\s\S]*?` matches dimensions on any later tag,
  // which is exactly how the drawer-overlay guard in this file went blind in round 12.
  const imgStart = home.indexOf('class="project-card-img"');
  expect(imgStart).toBeGreaterThan(-1);
  const img = home.slice(imgStart, home.indexOf('/>', imgStart));
  expect(img).toMatch(/width="600"/);
  expect(img).toMatch(/height="600"/);
  // Dimensions now come from the resolver rather than a hardcoded pair, so assert that both
  // are declared and that the fallback is still there — not one literal spelling of them.
  expect(projects).toMatch(
    /src=\{imageUrl\}[\s\S]*?width=\{resolved\?\.width[\s\S]*?height=\{resolved\?\.height/
  );
});
