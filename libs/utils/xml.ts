// Shared by the RSS and sitemap endpoints. They each had their own idea of escaping: RSS
// defined one inline and applied it to item fields but not to its channel strings, and the
// sitemap had none at all — so a single CMS slug containing `&`, `<` or `>` would produce a
// document that fails XML parsing, taking the whole feed or sitemap down for every crawler
// rather than just that one entry.
export const escapeXml = (value: string): string =>
  value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });
