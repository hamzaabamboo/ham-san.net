import { describe, expect, it } from 'bun:test';
import { withLastGood, withLastGoodState } from '../src/utils/cms-cache';

describe('withLastGood', () => {
  it('returns and caches successful results', async () => {
    expect(await withLastGood('a', async () => 1)).toBe(1);
    expect(await withLastGood('a', async () => 2)).toBe(2);
  });

  it('serves the last good value when the fetcher fails', async () => {
    await withLastGood('b', async () => 'good');
    expect(
      await withLastGood('b', async () => {
        throw new Error('down');
      })
    ).toBe('good');
  });

  it('reports whether a value came from the last-good cache', async () => {
    expect(await withLastGoodState('state', async () => 'fresh')).toEqual({
      value: 'fresh',
      fromCache: false
    });
    expect(
      await withLastGoodState('state', async () => {
        throw new Error('down');
      })
    ).toEqual({ value: 'fresh', fromCache: true });
  });

  it('rethrows when there is no cached value', async () => {
    await expect(
      withLastGood('c', async () => {
        throw new Error('down');
      })
    ).rejects.toThrow('down');
  });

  it('keeps keys independent', async () => {
    await withLastGood('d1', async () => 'one');
    await expect(
      withLastGood('d2', async () => {
        throw new Error('down');
      })
    ).rejects.toThrow('down');
  });

  it('does not replace last-good data when shouldStore rejects a value', async () => {
    await withLastGood('store-filter', async () => 'good');
    expect(
      await withLastGood(
        'store-filter',
        async () => 'bad',
        () => false
      )
    ).toBe('bad');
    expect(
      await withLastGood('store-filter', async () => {
        throw new Error('down');
      })
    ).toBe('good');
  });

  it('evicts the oldest entry when the cache reaches its bound', async () => {
    for (let index = 0; index < 257; index += 1) {
      await withLastGood(`evict:${index}`, async () => index);
    }

    await expect(
      withLastGood('evict:0', async () => {
        throw new Error('down');
      })
    ).rejects.toThrow('down');
  });
});
