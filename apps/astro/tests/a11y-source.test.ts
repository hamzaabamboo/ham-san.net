import { expect, test } from 'bun:test';

test('drawer overlay is a labeled semantic button', async () => {
  const source = await Bun.file('apps/astro/src/components/layout/Sidebar.tsx').text();
  expect(source).toMatch(
    /<button\s+className="shell-drawer-overlay"[\s\S]*?aria-label=\{t\('common\.menu-close'\)\}/
  );
});

test('reduced motion disables CSS and Lenis smooth scrolling', async () => {
  const css = await Bun.file('apps/astro/src/index.css').text();
  const component = await Bun.file('apps/astro/src/components/common/SmoothScroll.tsx').text();

  expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*?scroll-behavior: auto/);
  expect(component).toContain("matchMedia('(prefers-reduced-motion: reduce)').matches");
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

  expect(home).toMatch(/class="project-card-img"[\s\S]*?width="600"[\s\S]*?height="600"/);
  expect(projects).toMatch(/src=\{imageUrl\}[\s\S]*?width="960"[\s\S]*?height="540"/);
});
