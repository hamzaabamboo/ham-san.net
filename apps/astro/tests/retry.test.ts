import { expect, test } from 'bun:test';
import { retryOnce } from '../src/utils/retry';

test('retries one transient failure and returns the second result', async () => {
  let attempts = 0;
  const result = await retryOnce(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('transient');
    return 'ok';
  });

  expect(result).toBe('ok');
  expect(attempts).toBe(2);
});
