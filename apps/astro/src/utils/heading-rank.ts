// CMS markdown authors pick heading depth by eye, so a document whose shallowest heading is
// `####` must still start at the container's rank rather than jumping to `h6`. Rank on the
// SEQUENCE of levels actually present, not on the absolute depth.
//
// The scanner must agree with the renderer about what a heading is. Anything it counts that
// react-markdown does not render as a heading injects a phantom level and shifts every real
// heading down a rank; anything it misses that the renderer DOES emit collapses two ranks
// together. Both directions have bitten this module, so the ordering below matters:
// fences are consumed first (a comment delimiter can live inside one), then comments,
// then HTML blocks.

// A fence may be indented up to three spaces, must be closed by a run at least as long as
// the opener, and runs to EOF when never closed.

export const FRONTMATTER = /^﻿?---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/;

// Headings are valid inside a blockquote, so the marker is stripped before matching.
const QUOTE = /^ {0,3}(?:> ?)+/;
// A list marker may precede a heading inside a list item.
const LIST_MARKER = /^ {0,3}(?:[-*+]|\d+[.)])\s+/;
const ATX = /^ {0,3}(#{1,6})(?:\s|$)/;
// Only a paragraph can be underlined; after a list item, heading, quote or another break a
// `-` run is a thematic break, which renders as <hr>.
// A table row and a link-reference definition are not paragraphs either, so a `---` after
// one of them is a thematic break rather than a setext underline.
// Only a CommonMark "type 6" tag opens an HTML block that can INTERRUPT a paragraph. Any
// other tag (type 7) opens one only where a paragraph could start, so treating `<br>` or
// `<span>` as a block swallowed the headings after it.
const HTML_BLOCK_INTERRUPTING =
  /^ {0,3}<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:[\s/>]|$)/i;

// A type-7 block also requires the line to hold NOTHING but the tag, so `<span>x</span>`
// is ordinary paragraph text rather than the start of a block.
const HTML_BLOCK_ALONE = /^ {0,3}<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^>]*)?\/?>[ \t]*$/;

// A tab advances to the next 4-column stop. Counting indentation in spaces alone made
// tab-indented list content read as top-level text and tab-indented code read as a
// paragraph a `---` could underline.
const expandTabs = (line: string) =>
  line.replace(/^[ \t]+/, (run) => {
    let column = 0;
    let out = '';
    for (const character of run) {
      if (character === '\t') {
        const next = (Math.floor(column / 4) + 1) * 4;
        out += ' '.repeat(next - column);
        column = next;
      } else {
        out += ' ';
        column += 1;
      }
    }
    return out;
  });

const NOT_A_PARAGRAPH = /^ {0,3}(?:#{1,6}[\s]|[-*+]\s|\d+[.)]\s|>|\||\[[^\]]+\]:|-+\s*$|=+\s*$)/;

export const authoredHeadingLevels = (content: string): number[] => {
  const body = content.replace(/\r\n/g, '\n').replace(FRONTMATTER, '');

  const levels = new Set<number>();
  const lines = body.split('\n');
  // One walk handles fences, HTML comments and HTML blocks together, because their
  // precedence matters: a `<!--` inside a fenced block is code, and a fence opened inside a
  // blockquote ends when the blockquote does. Stripping any of them as a separate regex
  // pass got one of those orderings wrong every time it was tried.
  let fence: { marker: string; length: number; depth: number } | null = null;
  let inComment = false;
  let inHtmlBlock = false;
  // Setext needs to know whether a PARAGRAPH is open, which cannot be recovered by
  // re-testing the previous line's text: a fence close, an ATX heading and a blank line all
  // leave a non-blank or paragraph-looking line behind while closing the paragraph, and a
  // lazy continuation keeps the paragraph at its own container's depth rather than the
  // continuation line's. Track it instead.
  let paragraph: { depth: number; inList: boolean } | null = null;
  // An indented line only continues a list item when a list is actually open; otherwise it
  // is an indented code block, which ends the moment an unindented line follows.
  let inListBlock = false;
  // A GFM table absorbs the unindented lines after it, so text below one is another row
  // rather than a new paragraph a `---` could underline.
  let inTable = false;
  // A line after a link-reference definition continues it as a paragraph even when indented
  // four spaces, so the indented-code rule below does not apply there.
  let afterDefinition = false;

  const quoteDepth = (line: string) => (line.match(QUOTE)?.[0].match(/>/g) ?? []).length;
  const unquote = (line: string) => line.replace(QUOTE, '');

  lines.forEach((line) => {
    const depth = quoteDepth(line);
    const unquoted = expandTabs(unquote(line));
    const bare = unquoted.replace(LIST_MARKER, '');

    if (fence) {
      if (depth < fence.depth) {
        // The blockquote containing the fence ended, so the fence ended with it.
        fence = null;
      } else {
        // A closing run only closes a fence opened at the SAME quote depth: a ``` inside a
        // blockquote must not terminate an unclosed fence opened at the top level.
        // Checked against the line WITHOUT its list marker stripped: a closing fence cannot
        // be preceded by one, whereas `- ``` ` legitimately OPENS a fence in a list item.
        const close = depth === fence.depth && unquoted.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
        if (close && close[1][0] === fence.marker && close[1].length >= fence.length) fence = null;
        return;
      }
    }

    if (inComment) {
      if (unquoted.includes('-->')) inComment = false;
      return;
    }
    if (inHtmlBlock) {
      if (!unquoted.trim()) inHtmlBlock = false;
      return;
    }

    // Computed before the fence and HTML branches, because those consume their lines and
    // would otherwise hide both a list opened by ``- ``` `` and a list ended by a block.
    const isMarker = LIST_MARKER.test(unquoted);
    const indented = /^\s{2,}/.test(unquoted);
    if (isMarker) inListBlock = true;
    // A blockquote at column 0 ends the list; a table row continues to belong to it, and a
    // row after the first arrives with the paragraph already closed by the table itself.
    else if (depth > 0 && !indented) inListBlock = false;
    else if (unquoted.trim() && !indented && !paragraph && !/^ {0,3}\|/.test(unquoted))
      inListBlock = false;

    const open = bare.match(/^ {0,3}(`{3,}|~{3,})/);
    if (open) {
      fence = { marker: open[1][0], length: open[1].length, depth };
      paragraph = null;
      inTable = false;
      // A fence at column 0 ends the list; one opened ON a marker line starts inside it.
      if (!indented && !isMarker) inListBlock = false;
      return;
    }

    // An HTML comment opens a block that runs to the line containing `-->`, so an ATX
    // heading written after one on the same line is part of the block, not a heading.
    if (/^ {0,3}<!--/.test(unquoted)) {
      if (!unquoted.includes('-->')) inComment = true;
      paragraph = null;
      inTable = false;
      if (!indented) inListBlock = false;
      return;
    }
    // An HTML line below the open paragraph's blockquote depth is neither a lazy
    // continuation nor a block start: it closes the quote and is consumed with it.
    if (
      paragraph &&
      (depth < paragraph.depth || (paragraph.inList && !indented)) &&
      HTML_BLOCK_ALONE.test(unquoted)
    ) {
      paragraph = null;
      inTable = false;
      if (!indented) inListBlock = false;
      return;
    }
    if (
      /^ {0,3}<[A-Za-z!/?]/.test(unquoted) &&
      (HTML_BLOCK_INTERRUPTING.test(unquoted) ||
        (!paragraph && !afterDefinition && HTML_BLOCK_ALONE.test(unquoted)))
    ) {
      inHtmlBlock = true;
      paragraph = null;
      inTable = false;
      if (!indented) inListBlock = false;
      return;
    }

    if (!unquoted.trim()) {
      paragraph = null;
      inTable = false;
      afterDefinition = false;
      return;
    }

    // Content indented past a marker is inside the item, so an ATX heading there can sit
    // deeper than three spaces without being indented code, and a `-` run under it is a
    // thematic break rather than a setext underline.
    const inList = isMarker || (inListBlock && indented);
    const code = /^ {4,}/.test(unquoted);
    if (code) inTable = false;

    // A blockquote, a list item and a table all interrupt an open paragraph, so what
    // follows belongs to the new container and a later underline back at column 0 is lazy
    // rather than a setext rule.
    if (/^ {0,3}\|/.test(unquoted)) {
      inTable = true;
      paragraph = null;
    }
    if (paragraph && depth > paragraph.depth) paragraph = { depth, inList };
    if (isMarker) paragraph = { depth, inList: true };

    const atx =
      bare.match(ATX) ??
      (inList || paragraph?.inList ? bare.match(/^\s{0,7}(#{1,6})(?:\s|$)/) : null);
    if (atx) {
      levels.add(atx[1].length);
      paragraph = null;
      inTable = false;
      if (!inList) inListBlock = false;
      return;
    }

    // A setext underline is never lazy: it must sit in the same container as the paragraph
    // it underlines, so neither a differing blockquote depth nor an unindented run under a
    // list item's paragraph is one.
    if (paragraph && paragraph.depth === depth && !paragraph.inList) {
      if (/^ {0,3}=+\s*$/.test(bare)) {
        levels.add(1);
        paragraph = null;
        return;
      }
      if (/^ {0,3}-+\s*$/.test(bare)) {
        levels.add(2);
        paragraph = null;
        return;
      }
    }

    // A run that was not consumed as a setext underline is a thematic break, which closes
    // both the paragraph and the blockquote or list it was sitting in.
    if (/^ {0,3}(?:(?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})$/.test(unquoted)) {
      paragraph = null;
      inListBlock = false;
      inTable = false;
      return;
    }

    // A list item's text IS a paragraph — it just lives inside the item, so a later run at
    // column 0 underlines nothing. A table row, link-reference definition or rule is not a
    // paragraph at all.
    // With no paragraph open to continue, four spaces is an indented code block, not text.
    const opensParagraph =
      (isMarker || !NOT_A_PARAGRAPH.test(unquoted)) && !(code && !inList && !afterDefinition);
    if (!paragraph && !inTable && opensParagraph) paragraph = { depth, inList };
    afterDefinition = /^ {0,3}\[[^\]]+\]:/.test(unquoted);
  });

  return [...levels].sort((a, b) => a - b);
};

export const makeRankOf = (levels: number[]) => (level: number) => {
  const index = levels.indexOf(level);
  if (index !== -1) return index + 1;
  // An unseen level must not fall back to its own depth — that reintroduces the absolute
  // mapping this exists to remove. Rank it against the nearest shallower level present.
  const shallower = levels.filter((candidate) => candidate < level).length;
  return Math.max(1, shallower === 0 ? 1 : shallower + 1);
};
