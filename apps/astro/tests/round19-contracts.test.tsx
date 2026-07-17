import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppCarousel } from '../src/components/common/Carousel';
import {
  getCarouselKeyAction,
  handleCarouselKeyNavigation,
  navigateCarousel,
  navigateCarouselByKey,
  subscribeToReducedMotion
} from '../src/components/ui/carousel-motion';
import { useTranslations } from '../src/i18n/utils';

const findClosingDiv = (html: string, marker: string) => {
  const markerIndex = html.indexOf(marker);
  const openIndex = html.lastIndexOf('<div', markerIndex);
  let depth = 0;
  for (const match of html.slice(openIndex).matchAll(/<div\b|<\/div>/g)) {
    depth += match[0] === '</div>' ? -1 : 1;
    if (depth === 0) return openIndex + (match.index ?? 0);
  }
  return -1;
};

test('locale-dependent chrome is not persisted across locale switches', async () => {
  const source = await Bun.file('apps/astro/src/layouts/MainLayout.astro').text();
  expect(source).not.toContain('transition:persist="navbar"');
  expect(source).not.toContain('transition:persist="sidebar"');
  expect(source).not.toContain('transition:persist="footer"');
});

test('locale alternates preserve query state', async () => {
  const source = await Bun.file('apps/astro/src/layouts/BaseLayout.astro').text();
  expect(source).toContain('Astro.url.search');
});

test('hobby list cache cannot leak localized fallbacks across locales', async () => {
  const source = await Bun.file('apps/astro/src/pages/[locale]/hobbies/index.astro').text();
  expect(source).toContain('`hobbies:list:${locale}`');
});

test('Outline child requests reject non-ok responses before caching', async () => {
  const notes = await Bun.file('apps/astro/src/pages/[locale]/notes/[...slug]/index.astro').text();
  const hobbies = await Bun.file(
    'apps/astro/src/pages/[locale]/hobbies/[...slug]/index.astro'
  ).text();
  expect(notes).toMatch(/note-siblings:[\s\S]*?requireOutlineOk\(request, 'documents\.list'\)/);
  expect(notes).toContain('siblingsUnavailable = true');
  expect(hobbies).toMatch(/request\.response\.status === 404/);
  expect(hobbies).toMatch(/requireOutlineOk\(request, 'documents\.info'\)/);
  expect(hobbies).toContain("throw new Error('hobbies collection not configured')");
});

test('project grouping labels describe activity, not featured state', () => {
  const en = useTranslations('en');
  const ja = useTranslations('ja');
  const th = useTranslations('th');
  expect(en('project.active')).toBe('Active');
  expect(en('project.inactive')).toBe('Inactive');
  expect(ja('project.active')).toBe('アクティブ');
  expect(th('project.inactive')).toBe('ไม่ได้ใช้งาน');
});

test('RSS omits publication dates when the source is undated', async () => {
  const source = await Bun.file('apps/astro/src/pages/[locale]/rss.xml.ts').text();
  expect(source).not.toContain('new Date().toUTCString()');
  expect(source).toContain("pubDate ? `\\n      <pubDate>${pubDate}</pubDate>` : ''");
});

test('zero-count tags and localized field-note titles remain visible', async () => {
  const tag = await Bun.file('apps/astro/src/components/tags/TagBadge.tsx').text();
  const fieldNotes = await Bun.file(
    'apps/astro/src/components/hobbies/embeds/FieldNotesEmbed.tsx'
  ).text();
  expect(tag).toContain('showCount && `(${count})`');
  expect(fieldNotes).toContain("title ?? moduleTitle ?? 'Note links'");
});

test('carousel motion preserves preference and keyboard semantics', () => {
  const calls: Array<[string, number | boolean | undefined, boolean | undefined]> = [];
  const carousel = {
    pageSnapPoints: [0, 100, 200],
    scrollNext: (instant?: boolean) => calls.push(['next', instant, undefined]),
    scrollPrev: (instant?: boolean) => calls.push(['previous', instant, undefined]),
    scrollTo: (index: number, instant?: boolean) => calls.push(['to', index, instant])
  };
  navigateCarousel(carousel, 'previous', false);
  navigateCarousel(carousel, 'next', true);
  navigateCarousel(carousel, 1, true);
  navigateCarousel(carousel, 'first', true);
  navigateCarousel(carousel, 'last', true);
  expect(calls).toEqual([
    ['previous', false, undefined],
    ['next', true, undefined],
    ['to', 1, true],
    ['to', 0, true],
    ['to', 2, true]
  ]);
  expect(getCarouselKeyAction('ArrowUp', 'horizontal', 'ltr')).toBeNull();
  expect(getCarouselKeyAction('ArrowDown', 'horizontal', 'ltr')).toBeNull();
  expect(getCarouselKeyAction('ArrowLeft', 'horizontal', 'ltr')).toBe('previous');
  expect(getCarouselKeyAction('ArrowLeft', 'horizontal', 'rtl')).toBe('next');
  expect(getCarouselKeyAction('ArrowUp', 'vertical', 'ltr')).toBe('previous');
  expect(getCarouselKeyAction('ArrowDown', 'vertical', 'rtl')).toBe('next');
  expect(getCarouselKeyAction('Home', 'horizontal', 'ltr')).toBe('first');
  expect(getCarouselKeyAction('End', 'vertical', 'rtl')).toBe('last');
  calls.length = 0;
  expect(navigateCarouselByKey(carousel, 'ArrowRight', 'horizontal', 'ltr', true, true)).toBe(
    false
  );
  expect(calls).toEqual([]);

  const order: string[] = [];
  const event = {
    key: 'ArrowRight',
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
      order.push('prevent');
    }
  };
  const orderedCarousel = {
    ...carousel,
    scrollNext: (instant?: boolean) => order.push(`next:${instant}`)
  };
  handleCarouselKeyNavigation(event, orderedCarousel, 'horizontal', 'ltr', true, (current) => {
    order.push('consumer');
    current.preventDefault();
  });
  expect(order).toEqual(['consumer', 'prevent']);
  event.defaultPrevented = false;
  order.length = 0;
  handleCarouselKeyNavigation(event, orderedCarousel, 'horizontal', 'ltr', true, () => {
    order.push('consumer');
  });
  expect(order).toEqual(['consumer', 'next:true', 'prevent']);
  expect(navigateCarouselByKey(carousel, 'ArrowRight', 'horizontal', 'ltr', true, false)).toBe(
    true
  );
  expect(calls).toEqual([['next', true, undefined]]);
  calls.length = 0;
  expect(navigateCarouselByKey(carousel, 'ArrowRight', 'horizontal', 'ltr', false, false)).toBe(
    false
  );
  expect(calls).toEqual([]);

  let matches = false;
  let listener: EventListener | null = null;
  let removed: EventListener | null = null;
  const media = {
    get matches() {
      return matches;
    },
    addEventListener: (_type: string, callback: EventListener) => {
      listener = callback;
    },
    removeEventListener: (_type: string, callback: EventListener) => {
      removed = callback;
    }
  } as unknown as Pick<MediaQueryList, 'addEventListener' | 'matches' | 'removeEventListener'>;
  const preferences: boolean[] = [];
  const cleanup = subscribeToReducedMotion(media, (value) => preferences.push(value));
  expect(preferences).toEqual([false]);
  matches = true;
  listener?.({} as Event);
  expect(preferences).toEqual([false, true]);
  cleanup();
  expect(removed).toBe(listener);
});

test('carousel renders semantic controls with descriptive localized image labels', async () => {
  const html = renderToStaticMarkup(
    <AppCarousel
      images={['/one.jpg', '/two.jpg']}
      previousSlideLabel="Vorheriges Bild"
      nextSlideLabel="Nächstes Bild"
      gotoSlideLabel="Gehe zu Bild"
      slideLabel="Bild"
      startRotationLabel="Wiedergabe starten"
      stopRotationLabel="Wiedergabe stoppen"
    />
  );
  const source = await Bun.file('apps/astro/src/components/common/Carousel.tsx').text();
  const wrapper = await Bun.file('apps/astro/src/components/ui/carousel.tsx').text();
  expect(html).toContain('aria-label="Vorheriges Bild"');
  expect(html).toContain('aria-label="Nächstes Bild"');
  expect(html).toContain('aria-label="Gehe zu Bild 1"');
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('alt="Bild 1"');
  expect(html.match(/data-part="item-group"/g)).toHaveLength(1);
  expect(html.match(/data-part="item"[^>]*aria-hidden="false"/g)).toHaveLength(1);
  expect(html.match(/data-part="item"[^>]*aria-hidden="true"/g)).toHaveLength(1);
  expect(html.indexOf('data-part="control"')).toBeGreaterThan(
    findClosingDiv(html, 'data-part="item-group"')
  );
  expect(html).toContain('width="1600" height="900"');
  expect(html).toContain('width="320" height="180"');
  expect(source).toContain('<styled.button');
  expect(source).toContain('aria-pressed={idx === index}');
  expect(source).toContain("'&:hover': { borderColor: '#ffb000' }");
  expect(source).toContain('aria-label={`${gotoSlideLabel} ${idx + 1}`}');
  expect(source).toContain('alt={`${slideLabel} ${index + 1}`}');
  expect(source).toContain('page={index}');
  expect(source).toContain('translations={{');
  expect(source).toContain(
    'indicator: (indicatorIndex) => `${gotoSlideLabel} ${indicatorIndex + 1}`'
  );
  expect(source).toContain("window.matchMedia('(prefers-reduced-motion: reduce)')");
  expect(source).toContain("navigateCarousel(carousel, 'previous', reducedMotion)");
  expect(source).toContain("navigateCarousel(carousel, 'next', reducedMotion)");
  expect(source).toContain('navigateCarousel(carousel, idx, reducedMotion)');
  expect(source).toContain('<UICarousel.IndicatorGroup instant={reducedMotion} />');
  expect(wrapper).toContain('carouselContext.pageSnapPoints.map');
  expect(wrapper).toContain('handleCarouselKeyNavigation(');
  expect(source).toMatch(/width=\{1600\}[\s\S]*?height=\{900\}/);
  expect(source).toMatch(/width=\{320\}[\s\S]*?height=\{180\}/);
});
