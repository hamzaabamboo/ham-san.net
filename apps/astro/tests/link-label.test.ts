import { describe, expect, test } from 'bun:test';
import { formatBareUrlLabel, truncateLinkLabel } from '../src/utils/link-label';

describe('formatBareUrlLabel', () => {
  test('keeps the discriminating part of sibling lenstip URLs', () => {
    const tamron = formatBareUrlLabel(
      'https://www.lenstip.com/284.4-Lens_review-Tamron_SP_70-300_mm_f_4-5.6_Di_VC_USD_Image_resolution.html'
    );
    const canon = formatBareUrlLabel(
      'https://www.lenstip.com/6.4-Lens_review-Canon_EF_28-135_mm_f_3.5-5.6_IS_USM_Image_resolution_.html'
    );
    expect(tamron).toContain('Tamron');
    expect(canon).toContain('Canon');
    expect(tamron).not.toBe(canon);
  });

  test('drops the leading id token and the file extension', () => {
    expect(
      formatBareUrlLabel(
        'https://www.lenstip.com/157.1-Lens_review-Nikon_Nikkor_AF-S_DX_35_mm.html'
      )
    ).toBe('lenstip.com⁠ / Lens review Nikon Nikkor AF S DX 35 mm');
  });

  test('picks the most informative path segment, not the last one', () => {
    expect(
      formatBareUrlLabel(
        'https://www.imaging-resource.com/lenses/nikon/18-105mm-f3.5-5.6g-ed-vr-dx-af-s-nikkor/review/'
      )
    ).toContain('18 105mm');
  });

  test('falls back to the host when there is no path', () => {
    expect(formatBareUrlLabel('https://apex106.com')).toBe('apex106.com');
    expect(formatBareUrlLabel('https://note.com/')).toBe('note.com');
  });

  test('accepts bare www URLs and returns non-URLs unchanged', () => {
    expect(formatBareUrlLabel('www.lenstip.com/284.4-Lens_review-Tamron.html')).toContain(
      'lenstip.com'
    );
    expect(formatBareUrlLabel('not a url')).toBe('not a url');
  });

  test('decodes percent-encoded segments', () => {
    expect(formatBareUrlLabel('https://example.com/%E5%86%99%E7%9C%9F')).toBe(
      'example.com⁠ / 写真'
    );
  });
});

describe('truncateLinkLabel', () => {
  test('leaves short labels untouched', () => {
    expect(truncateLinkLabel('short label', 52)).toBe('short label');
  });

  test('truncates on a word boundary and joins the ellipsis', () => {
    const result = truncateLinkLabel(
      'Lens review Tamron SP 70 300 mm f 4 5.6 Di VC USD Image resolution',
      52
    );
    expect(result.endsWith('⁠…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(54);
    expect(result).toContain('Tamron');
  });
});
