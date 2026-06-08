import { describe, expect, test } from 'bun:test';
import { parseHobbyContent, splitHobbyBodyParts } from '../src/utils/hobby-content';

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

  test('extracts labeled slot directives and leaves an in-content placeholder', () => {
    const content = parseHobbyContent({
      title: 'Rubiks',
      text: `Practice notes.

::hobby[rubik|PLL trainer]

More notes.`
    });

    expect(content.embeds).toEqual([{ type: 'rubik-algorithms', label: 'PLL trainer' }]);
    expect(content.body).toBe(`Practice notes.

<!-- hobby-embed:0 -->

More notes.`);
  });

  test('extracts object slot directives with labels and leaves an in-content placeholder', () => {
    const content = parseHobbyContent({
      title: 'Typing',
      text: `Layout notes.

::hobby { type="typing" label="Profiles and links" }

Switch history.`
    });

    expect(content.embeds).toEqual([{ type: 'typing-stats', label: 'Profiles and links' }]);
    expect(content.body).toBe(`Layout notes.

<!-- hobby-embed:0 -->

Switch history.`);
  });

  test('uses source metadata before generated fallbacks', () => {
    const content = parseHobbyContent({
      title: 'Maps',
      text: `---
categoryDescription: Map references and practice routes.
image: /maps.png
active: false
updatedAt: 2026-06-04
---
- [Plonkit](https://www.plonkit.net/)`
    });

    expect(content.description).toBe('Map references and practice routes.');
    expect(content.banner).toBe('/maps.png');
    expect(content.status).toBe('inactive');
    expect(content.updatedAt).toBe('2026-06-04');
  });

  test('splits explicit embed placeholders inside markdown body', () => {
    expect(
      splitHobbyBodyParts(
        `Intro.

<!-- hobby-embed:0 -->

After slot.`,
        1
      )
    ).toEqual([
      { type: 'markdown', content: 'Intro.' },
      { type: 'embed', index: 0 },
      { type: 'markdown', content: 'After slot.' }
    ]);
  });

  test('places inferred embeds at the start when no explicit slot exists', () => {
    expect(splitHobbyBodyParts('Plain source note.', 1)).toEqual([
      { type: 'embed', index: 0 },
      { type: 'markdown', content: 'Plain source note.' }
    ]);
  });

  test('keeps multiple explicit embed slots in source order', () => {
    const content = parseHobbyContent({
      title: 'Mixed',
      text: `Start.

::hobby[photo|Gallery]

Middle.

::hobby { type="twitter" label="Feed" }

End.`
    });

    expect(content.embeds).toEqual([
      { type: 'photo-gallery', label: 'Gallery' },
      { type: 'twitter-feed', label: 'Feed' }
    ]);
    expect(splitHobbyBodyParts(content.body, content.embeds.length)).toEqual([
      { type: 'markdown', content: 'Start.' },
      { type: 'embed', index: 0 },
      { type: 'markdown', content: 'Middle.' },
      { type: 'embed', index: 1 },
      { type: 'markdown', content: 'End.' }
    ]);
  });

  test('supports shorthand component slot directives', () => {
    const content = parseHobbyContent({
      title: 'Shorthand',
      text: `Intro.

::photo[Gallery]

Middle.

::typing[Profiles]

End.`
    });

    expect(content.embeds).toEqual([
      { type: 'photo-gallery', label: 'Gallery' },
      { type: 'typing-stats', label: 'Profiles' }
    ]);
    expect(splitHobbyBodyParts(content.body, content.embeds.length)).toEqual([
      { type: 'markdown', content: 'Intro.' },
      { type: 'embed', index: 0 },
      { type: 'markdown', content: 'Middle.' },
      { type: 'embed', index: 1 },
      { type: 'markdown', content: 'End.' }
    ]);
  });

  test('uses canonical embed labels for unlabeled aliases', () => {
    const content = parseHobbyContent({
      title: 'Aliases',
      text: `Intro.

::photo

Middle.

::rubik

End.`
    });

    expect(content.embeds).toEqual([
      { type: 'photo-gallery', label: 'photo-gallery' },
      { type: 'rubik-algorithms', label: 'rubik-algorithms' }
    ]);
  });

  test('keeps raw source sections for embeds but removes duplicate display sections', () => {
    const content = parseHobbyContent({
      title: 'Typing',
      text: `Intro.

::typing[Profiles]

# Profiles
- Typingstats: https://typingstats.com
- Monkeytype: https://monkeytype.com

# Links
- https://typingstats.com
- https://monkeytype.com
\\`
    });

    expect(content.links.map((link) => link.href)).toEqual([
      'https://typingstats.com',
      'https://monkeytype.com'
    ]);
    expect(content.sourceBody).toContain('# Profiles');
    expect(content.sourceBody).toContain('# Links');
    expect(content.body).toBe(`Intro.

<!-- hobby-embed:0 -->`);
  });

  test('preserves regular prose sections in the display body', () => {
    const content = parseHobbyContent({
      title: 'Camera',
      text: `Intro.

# Notes
This is actual prose that belongs on the page.

# Links
- https://photos.example.com`
    });

    expect(content.body).toContain('# Notes');
    expect(content.body).toContain('This is actual prose');
    expect(content.body).not.toContain('# Links');
  });
});
