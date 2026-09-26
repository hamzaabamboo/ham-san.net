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
    ).toBe('lenstip.com⁠ / Lens review-Nikon Nikkor AF-S DX 35 mm');
  });

  test('picks the most informative path segment, not the last one', () => {
    expect(
      formatBareUrlLabel(
        'https://www.imaging-resource.com/lenses/nikon/18-105mm-f3.5-5.6g-ed-vr-dx-af-s-nikkor/review/'
      )
    ).toContain('18-105mm');
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
    // Pin the exact string. The previous assertions — ends with the ellipsis, is short
    // enough, contains a word from the front — all held with the boundary logic deleted
    // entirely, so the test passed by construction and proved nothing about boundaries.
    expect(
      truncateLinkLabel('Lens review-Tamron SP 70-300 mm f 4-5.6 Di VC USD Image resolution', 52)
    ).toBe('Lens review-Tamron SP 70-300 mm f 4-5.6 Di VC USD\u2060…');
  });

  test('an EARLY space is not treated as a word boundary', () => {
    // The `> max * 0.6` gate itself: with a space at index 2, slicing there would return the
    // stub "ab…". Relaxing the gate to `lastSpace > 0` must fail here — the two cases below
    // cannot see that mutation, because in both of them the gate and `> 0` agree.
    expect(
      truncateLinkLabel('ab cdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuv', 52)
    ).toBe('ab cdefghijklmnopqrstuvwxyz0123456789abcdefghijklmno\u2060…');
  });

  test('a label with no late space is cut mid-token rather than gutted', () => {
    // The other side of the `lastSpace > max * 0.6` gate: with no space to fall back on the
    // function must still fill the budget instead of returning a stub.
    expect(
      truncateLinkLabel('averyveryverylongsingletokenwithnospacesatallgoesonandonandon', 52)
    ).toBe('averyveryverylongsingletokenwithnospacesatallgoesona\u2060…');
  });
});
