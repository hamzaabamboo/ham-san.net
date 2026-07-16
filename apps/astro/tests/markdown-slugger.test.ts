import { describe, expect, test } from 'bun:test';
import { createHeadingSlugger } from '../src/components/lib/Markdown';

describe('createHeadingSlugger', () => {
  test('slugs plain headings', () => {
    const slug = createHeadingSlugger();
    expect(slug('Lens References')).toBe('lens-references');
  });

  test('keeps Thai and Japanese letters', () => {
    const slug = createHeadingSlugger();
    expect(slug('สุขภาพ')).toBe('สุขภาพ');
    expect(slug('趣味の記録')).toBe('趣味の記録');
  });

  test('suffixes duplicate headings deterministically', () => {
    const slug = createHeadingSlugger();
    expect(slug('Notes')).toBe('notes');
    expect(slug('Notes')).toBe('notes-1');
    expect(slug('Notes')).toBe('notes-2');
  });

  test('strips markdown formatting inside heading text', () => {
    const slug = createHeadingSlugger();
    expect(slug('**Bold** and [link](https://example.com)')).toBe('bold-and-link');
  });

  test('falls back to an indexed slug for empty headings', () => {
    const slug = createHeadingSlugger();
    expect(slug('!!!')).toMatch(/^heading-\d+$/);
  });
});
