import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { TwitterFeedEmbed } from '../src/components/hobbies/embeds/TwitterFeedEmbed';

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
});
