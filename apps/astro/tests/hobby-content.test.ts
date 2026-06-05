import { describe, expect, test } from 'bun:test';
import { parseHobbyContent } from '../src/utils/hobby-content';

describe('parseHobbyContent', () => {
  test('uses frontmatter labels for inferred embed modules', () => {
    const content = parseHobbyContent({
      title: 'Camera',
      text: `---
embed: photo
embedLabel: Contact sheets
status: active
banner: /camera.jpg
updated: 2026-06-05
---
Pictures, gear, and lens references.
`
    });

    expect(content.embeds).toEqual([{ type: 'photo-gallery', label: 'Contact sheets' }]);
    expect(content.banner).toBe('/camera.jpg');
    expect(content.status).toBe('active');
    expect(content.updatedAt).toBe('2026-06-05');
  });

  test('extracts labeled slot directives and removes them from body', () => {
    const content = parseHobbyContent({
      title: 'Rubiks',
      text: `Practice notes.

::hobby[rubik|PLL trainer]

More notes.`
    });

    expect(content.embeds).toEqual([{ type: 'rubik-algorithms', label: 'PLL trainer' }]);
    expect(content.body).toBe(`Practice notes.

More notes.`);
  });
});
