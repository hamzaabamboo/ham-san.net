import { describe, expect, test } from 'bun:test';
import {
  dedupeHobbyLinks,
  getHobbyEmbedLinks,
  getHobbyRenderedLinks,
  getRubikResourceLinks,
  getTypingProfileLinks
} from '../src/utils/hobby-links';

const link = (href: string, label = href) => ({ href, label });

describe('hobby link selection', () => {
  test('dedupes identical hrefs while preserving order', () => {
    expect(
      dedupeHobbyLinks([
        link('https://a.example.com', 'First'),
        link('https://b.example.com'),
        link('https://a.example.com', 'Duplicate')
      ])
    ).toEqual([link('https://a.example.com', 'First'), link('https://b.example.com')]);
  });

  test('typing selection keeps every matching profile link without a cap', () => {
    const links = [
      link('https://typingstats.com/profile/hamp'),
      link('https://keymash.io/profile/HamP-2581/'),
      link('https://monkeytype.com/profile/qYa'),
      link('https://data.typeracer.com/pit/profile?user=hamzaabamboo'),
      link('https://10fastfingers.com/user/3914004/'),
      link('https://10fastfingers.com/user/3924503/'),
      link('https://typingstats.com/'),
      link('https://taisoku.com/')
    ];

    const selected = getTypingProfileLinks(links);
    expect(selected).toHaveLength(7);
    expect(selected.map((item) => item.href)).not.toContain('https://taisoku.com/');
  });

  test('typing selection falls back to all links when no profile matches', () => {
    const links = [link('https://taisoku.com/'), link('https://example.com/keyboards')];
    expect(getTypingProfileLinks(links)).toEqual(links);
  });

  test('rubik selection keeps only cubing resources', () => {
    expect(
      getRubikResourceLinks([
        link('https://speedcubedb.com/trainer'),
        link('https://cstimer.net/'),
        link('https://docs.google.com/spreadsheets/d/1ikOCqBgr', 'PBs/Split'),
        link('https://www.ao1k.com/recon/')
      ]).map((item) => item.href)
    ).toEqual(['https://speedcubedb.com/trainer', 'https://cstimer.net/']);
  });

  test('embed selection defaults to all deduped links for library modules', () => {
    const links = [link('https://a.example.com'), link('https://a.example.com')];
    expect(getHobbyEmbedLinks('link-library', links)).toHaveLength(1);
    expect(getHobbyEmbedLinks('field-notes', links)).toHaveLength(1);
    expect(getHobbyEmbedLinks('darts-board', links)).toHaveLength(0);
    expect(getHobbyEmbedLinks('piano-chords', links)).toHaveLength(0);
  });

  test('rendered links merge embed selection with display body links without duplicates', () => {
    const rendered = getHobbyRenderedLinks({
      type: 'photo-gallery',
      links: [
        link('https://photos.app.goo.gl/abc123'),
        link('https://note.com/livephoto'),
        link('https://www.lenstip.com/review.html'),
        link('https://www.imaging-resource.com/hidden-review')
      ],
      body: `# Lens References
- https://www.lenstip.com/review.html

# Venue
- https://note.com/livephoto`
    });

    expect(rendered.map((item) => item.href)).toEqual([
      'https://photos.app.goo.gl/abc123',
      'https://note.com/livephoto',
      'https://www.lenstip.com/review.html'
    ]);
  });

  test('photo gallery counts only body links when images render instead of sources', () => {
    expect(
      getHobbyRenderedLinks({
        type: 'photo-gallery',
        links: [link('https://photos.app.goo.gl/abc123')],
        body: 'No links here.',
        images: ['/gallery/one.jpg']
      })
    ).toHaveLength(0);
  });
});
