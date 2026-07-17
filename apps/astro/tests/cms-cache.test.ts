import { describe, expect, it } from 'bun:test';
import { withLastGood } from '../src/utils/cms-cache';

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
});
