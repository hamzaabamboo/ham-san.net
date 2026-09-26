export async function parseMarkdown(text: string) {
  const { fromMarkdown } = await import('mdast-util-from-markdown');
  const { gfmFromMarkdown } = await import('mdast-util-gfm');
  const { gfm } = await import('micromark-extension-gfm');

  const tree = fromMarkdown(text, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });

  return tree;
}
