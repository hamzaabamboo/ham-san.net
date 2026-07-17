import { describe, expect, test } from 'bun:test';
import { getHobbyDetailResponse } from '../src/utils/hobby-detail-response';

describe('getHobbyDetailResponse', () => {
  test('treats failed or missing settings as unavailable', () => {
    expect(getHobbyDetailResponse({ settingsAvailable: false })).toEqual({
      status: 503,
      cacheControl: 'no-store',
      redirectTo404: false
    });
  });

  test('redirects only genuine document 404 responses', () => {
    expect(getHobbyDetailResponse({ settingsAvailable: true, documentStatus: 404 })).toEqual({
      status: 404,
      cacheControl: 'no-store',
      redirectTo404: true
    });
  });

  test('treats non-ok document responses and empty success payloads as unavailable', () => {
    expect(getHobbyDetailResponse({ settingsAvailable: true, documentStatus: 500 })).toMatchObject({
      status: 503,
      cacheControl: 'no-store'
    });
    expect(
      getHobbyDetailResponse({ settingsAvailable: true, documentStatus: 200, hasDocument: false })
    ).toMatchObject({ status: 503, cacheControl: 'no-store' });
  });

  test('preserves content while marking child-list failures unavailable', () => {
    expect(
      getHobbyDetailResponse({
        settingsAvailable: true,
        documentStatus: 200,
        hasDocument: true,
        childDocumentsUnavailable: true
      })
    ).toEqual({ status: 503, cacheControl: 'no-store', redirectTo404: false });
  });

  test('allows normal caching only for complete successful content', () => {
    expect(
      getHobbyDetailResponse({
        settingsAvailable: true,
        documentStatus: 200,
        hasDocument: true
      })
    ).toEqual({
      status: 200,
      cacheControl: 'public, max-age=86400, must-revalidate',
      redirectTo404: false
    });
  });
});
