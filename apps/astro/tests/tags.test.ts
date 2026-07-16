import { describe, expect, test } from 'bun:test';
import { sortTags, tagSlug } from '../src/utils/tags';

describe('tagSlug', () => {
  test('kebab-cases the title when present', () => {
    expect(tagSlug({ title: 'D3.js', slug: 'd4' })).toBe('d3-js');
    expect(tagSlug({ title: 'Ruby on Rails', slug: 'rails' })).toBe('ruby-on-rails');
    expect(tagSlug({ title: 'MobX', slug: 'mob' })).toBe('mob-x');
  });

  test('falls back to the stored slug when the title is missing', () => {
    expect(tagSlug({ title: null, slug: 'rest' })).toBe('rest');
    expect(tagSlug({ slug: 'firebase' })).toBe('firebase');
  });

  test('returns an empty string when both are missing', () => {
    expect(tagSlug({ title: null, slug: null })).toBe('');
    expect(tagSlug({})).toBe('');
  });
});

describe('sortTags', () => {
  test('sorts by explicit order when both tags have one', () => {
    const sorted = sortTags([
      { type: 'Frontend', order: 2 },
      { type: 'Backend', order: 1 }
    ]);
    expect(sorted.map((tag) => tag?.order)).toEqual([1, 2]);
  });

  test('sorts orderless tags by type precedence', () => {
    const sorted = sortTags([{ type: 'Others' }, { type: 'Frontend' }, { type: 'Database' }]);
    expect(sorted.map((tag) => tag?.type)).toEqual(['Frontend', 'Database', 'Others']);
  });

  test('places unknown types last', () => {
    const sorted = sortTags([{ type: 'Mystery' }, { type: 'Backend' }]);
    expect(sorted.map((tag) => tag?.type)).toEqual(['Backend', 'Mystery']);
  });

  test('does not mutate the input array', () => {
    const input = [{ type: 'Others' }, { type: 'Frontend' }];
    sortTags(input);
    expect(input.map((tag) => tag?.type)).toEqual(['Others', 'Frontend']);
  });
});
