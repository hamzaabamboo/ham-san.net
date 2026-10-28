import { describe, expect, it, spyOn } from 'bun:test';
import { withFreshLastGoodState, withLastGood, withLastGoodState } from '../src/utils/cms-cache';

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

describe('withFreshLastGoodState', () => {
  it('retains stale data if the shared last-good entry is evicted', async () => {
    await withFreshLastGoodState('fresh:evicted', async () => 'retained', 0);
    for (let index = 0; index < 256; index += 1) {
      await withLastGood(`fresh:other:${index}`, async () => index);
    }
    expect(
      await withFreshLastGoodState(
        'fresh:evicted',
        async () => {
          throw new Error('unavailable');
        },
        0
      )
    ).toEqual({ value: 'retained', fromCache: true });
  });

  it('retries after a failure when there is no earlier value', async () => {
    let calls = 0;
    const fetcher = async () => {
      calls += 1;
      if (calls === 1) throw new Error('unavailable');
      return 'recovered';
    };
    await expect(withFreshLastGoodState('fresh:cold-error', fetcher)).rejects.toThrow(
      'unavailable'
    );
    expect(await withFreshLastGoodState('fresh:cold-error', fetcher)).toEqual({
      value: 'recovered',
      fromCache: false
    });
  });

  it('shares concurrent requests for the same key', async () => {
    let calls = 0;
    let resolve!: (value: string) => void;
    const fetcher = () => {
      calls += 1;
      return new Promise<string>((done) => {
        resolve = done;
      });
    };
    const first = withFreshLastGoodState('fresh:concurrent', fetcher);
    const second = withFreshLastGoodState('fresh:concurrent', fetcher);
    expect(calls).toBe(1);
    resolve('public notes');
    expect(await Promise.all([first, second])).toEqual([
      { value: 'public notes', fromCache: false },
      { value: 'public notes', fromCache: false }
    ]);
  });

  it('refreshes after expiry and does not make a failed refresh fresh', async () => {
    const clock = spyOn(Date, 'now').mockReturnValue(1000);
    let calls = 0;
    const fetcher = async () => {
      calls += 1;
      if (calls === 2) throw new Error('unavailable');
      return `version ${calls}`;
    };
    try {
      expect(await withFreshLastGoodState('fresh:expiry', fetcher)).toEqual({
        value: 'version 1',
        fromCache: false
      });
      clock.mockReturnValue(60_999);
      expect((await withFreshLastGoodState('fresh:expiry', fetcher)).value).toBe('version 1');
      expect(calls).toBe(1);
      clock.mockReturnValue(61_000);
      expect(await withFreshLastGoodState('fresh:expiry', fetcher)).toEqual({
        value: 'version 1',
        fromCache: true
      });
      clock.mockReturnValue(61_001);
      expect(await withFreshLastGoodState('fresh:expiry', fetcher)).toEqual({
        value: 'version 3',
        fromCache: false
      });
    } finally {
      clock.mockRestore();
    }
  });
});
