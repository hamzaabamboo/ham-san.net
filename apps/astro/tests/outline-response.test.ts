import { expect, test } from 'bun:test';
import { requireOutlineOk } from '../src/utils/outline-response';

test('rejects non-ok Outline responses before they can enter last-good caches', () => {
  expect(() =>
    requireOutlineOk({ response: new Response(null, { status: 500 }) }, 'documents.list')
  ).toThrow('documents.list 500');
});
