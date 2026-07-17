import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { HobbyInteractiveEmbed } from '../src/components/hobbies/HobbyInteractiveEmbed';
import { PhotoGalleryEmbed } from '../src/components/hobbies/embeds/PhotoGalleryEmbed';
import { PianoChordsEmbed } from '../src/components/hobbies/embeds/PianoChordsEmbed';
import { RubikAlgorithmsEmbed } from '../src/components/hobbies/embeds/RubikAlgorithmsEmbed';
import { TwitterFeedEmbed } from '../src/components/hobbies/embeds/TwitterFeedEmbed';
import { TypingStatsEmbed } from '../src/components/hobbies/embeds/TypingStatsEmbed';

describe('hobby embeds', () => {
  test('twitter feed renders social profile links', () => {
    const html = renderToStaticMarkup(
      <TwitterFeedEmbed
        links={[
          { href: 'https://example.com/reference', label: 'Reference' },
          { href: 'https://x.com/ham', label: 'Ham on X' }
        ]}
      />
    );

    expect(html).toContain('x.com');
    expect(html).toContain('Ham on X');
    expect(html).not.toContain('example.com');
  });

  test('twitter feed uses an honest empty state when no feed link exists', () => {
    const html = renderToStaticMarkup(
      <TwitterFeedEmbed
        links={[{ href: 'https://example.com/reference', label: 'Reference' }]}
        noFeedLabel="No feed attached."
      />
    );

    expect(html).toContain('No feed attached.');
    expect(html).not.toContain('Reference');
    expect(html).not.toContain('example.com');
  });

  test('rubik embed without algorithms renders resources without duplicating related pages', () => {
    const html = renderToStaticMarkup(
      <RubikAlgorithmsEmbed
        body="Practice notes."
        links={[{ href: 'https://jperm.net/algs', label: 'OLL sheet' }]}
        nestedPages={[{ title: '3x3', href: '/en/hobbies/root/doc/child' }]}
      />
    );

    expect(html).toContain('jperm.net');
    expect(html).not.toContain('/en/hobbies/root/doc/child');
    expect(html).not.toContain('3x3');
    expect(html).not.toContain('<button');
  });

  test('rubik module renders an honest empty state without algorithms or resources', () => {
    const html = renderToStaticMarkup(
      <HobbyInteractiveEmbed
        type="rubik-algorithms"
        body="Practice notes."
        nestedPages={[{ title: '3x3', href: '/en/hobbies/root/doc/child' }]}
        noAlgorithmSetsLabel="No algorithm sets."
      />
    );

    expect(html).toContain('data-embed="rubik-algorithms"');
    expect(html).toContain('No algorithm sets.');
    expect(html).not.toContain('<button');
  });

  test('rubik embed resource filter does not match oll inside other words', () => {
    const html = renderToStaticMarkup(
      <RubikAlgorithmsEmbed
        body=""
        links={[
          { href: 'https://example.com/foam-roller', label: 'Foam Roller' },
          { href: 'https://jperm.net/algs', label: 'OLL sheet' }
        ]}
        noAlgorithmSetsLabel="No algorithm sets."
      />
    );

    expect(html).toContain('jperm.net');
    expect(html).not.toContain('Foam Roller');
  });

  test('piano module renders an honest empty state without chords', () => {
    const html = renderToStaticMarkup(
      <HobbyInteractiveEmbed
        type="piano-chords"
        body=""
        nestedPages={[{ title: 'Trombone', href: '/en/hobbies/music/doc/trombone' }]}
        noChordsLabel="No chords yet."
      />
    );

    expect(html).toContain('data-embed="piano-chords"');
    expect(html).toContain('No chords yet.');
  });

  test('piano module renders the chord player when playable chords exist alongside pages', () => {
    const html = renderToStaticMarkup(
      <HobbyInteractiveEmbed
        type="piano-chords"
        body={`# Chords

* Cmaj7: c4 e4 g4 b4`}
        nestedPages={[{ title: 'Trombone', href: '/en/hobbies/music/doc/trombone' }]}
      />
    );

    expect(html).toContain('Cmaj7');
    expect(html).toContain('<button');
  });

  test('piano embed shows an honest empty state without pages or chords', () => {
    const html = renderToStaticMarkup(<PianoChordsEmbed body="" noChordsLabel="No chords yet." />);

    expect(html).toContain('No chords yet.');
    expect(html).not.toContain('data-black');
  });

  test('typing stats derives distinct tile labels from paths for same-host profiles', () => {
    const html = renderToStaticMarkup(
      <TypingStatsEmbed
        links={[
          { href: 'https://10fastfingers.com/user/3914004/', label: '10fastfingers.com' },
          { href: 'https://10fastfingers.com/user/3924503/', label: '10fastfingers.com' },
          { href: 'https://monkeytype.com/profile/qYa', label: 'monkeytype.com' }
        ]}
      />
    );

    expect(html).toContain('/user/3914004');
    expect(html).toContain('/user/3924503');
    expect(html).toContain('/profile/qYa');
    expect(html).not.toContain('<strong>monkeytype.com</strong>');
    expect(html).not.toContain('<strong>10fastfingers.com</strong>');
  });

  test('photo gallery dedupes bare-domain link labels', () => {
    const html = renderToStaticMarkup(
      <PhotoGalleryEmbed
        links={[
          { href: 'https://photos.app.goo.gl/abc123', label: 'photos.app.goo.gl' },
          { href: 'https://photos.app.goo.gl/def456', label: 'photos.app.goo.gl' }
        ]}
        linkedPhotoSourcesLabel="Linked photo pages"
      />
    );

    expect(html).toContain('photos.app.goo.gl/abc123');
    expect(html).toContain('photos.app.goo.gl/def456');
  });

  test('photo gallery names thumbnail controls and exposes the selected image', () => {
    const html = renderToStaticMarkup(
      <PhotoGalleryEmbed images={['/one.jpg', '/two.jpg']} imageLabel="Photo" />
    );

    expect(html).toContain('aria-label="Photo 1"');
    expect(html).toContain('aria-label="Photo 2"');
    expect(html).toContain('alt="Photo 1"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
  });
});
