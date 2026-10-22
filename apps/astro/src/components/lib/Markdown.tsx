import { authoredHeadingLevels, FRONTMATTER, makeRankOf } from '~/utils/heading-rank';
import { join } from 'path';
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';
import remarkTextr from 'remark-textr';
import { Stack, styled } from 'styled-system/jsx';
import { Code } from '../ui/code';
import { Heading } from '../ui/heading';
import { Link } from '../ui/link';
import { Table } from '../ui/table';
import { Text } from '../ui/text';
import {
  defaultKnownLinkLabels,
  formatBareUrlLabel,
  type KnownLinkLabels
} from '~/utils/link-label';
import { resolveOutlineAssetUrl } from '~/utils/outline-assets';

const headingSlugBase = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`[\]#]/g, '')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

export const createHeadingSlugger = () => {
  const counts = new Map<string, number>();
  let index = 0;
  return (text: string) => {
    index += 1;
    const base = headingSlugBase(text);
    const slug = base || `heading-${index}`;
    const seen = counts.get(slug) ?? 0;
    counts.set(slug, seen + 1);
    return seen === 0 ? slug : `${slug}-${seen}`;
  };
};

// A chord chart or tab written in Outline arrives as ordinary paragraphs, one per line, so
// it was set in Manrope at a 52px pitch, so the bar columns did not line up and a two-screen
// chart became five. Two shapes only, both unambiguous and neither reachable from prose:
// a line GFM would have made a table row if it had carried a delimiter row (`| E | F#m |`),
// and a bracketed section label (`[Intro]`). Anything else stays prose.
const STRUCTURAL_LINE = /^\s*(?:\|.*|\[[^\]]+\](?:\s*\([^)]*\))?)\s*$/;
// `.` does not match a newline and `$` is end-of-string here, so a soft-wrapped paragraph
// that merely opens with a pipe already fails the test, so no separate line-count check is needed.
export const isStructuralLine = (text: string) => STRUCTURAL_LINE.test(text);

const CODE_SEGMENT = /(```[\s\S]*?```|`[^`\n]*`)/;
const RENDERED_URL = /(?<!\]\(|\]:\s*|[\w./:@%-])(?:https?:\/\/|www\.)[^\s<>()[\]]+/g;

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

type HastNode = { type: string; tagName?: string; value?: string; children?: HastNode[] };

const CHORD_LINE =
  /^\s*(?:(?:N\.C\.|[A-G][#b]?(?:maj|min|dim|aug|sus|add|m)?\d*(?:\/[A-G][#b]?)?)(?:\s+|$))+$/;

const HIGHLIGHT = /(\*\*)?==([^=\n]+?)==(\*\*)?/g;

const splitHighlights = (value: string): MdNode[] => {
  const out: MdNode[] = [];
  let last = 0;
  for (const match of value.matchAll(HIGHLIGHT)) {
    const start = match.index ?? 0;
    if (start > last) out.push({ type: 'text', value: value.slice(last, start) });
    const text: MdNode = { type: 'text', value: match[2] };
    const inner = match[1] && match[3] ? [{ type: 'strong', children: [text] }] : [text];
    out.push({ type: 'highlight', data: { hName: 'mark' }, children: inner });
    if (match[1] && !match[3]) out.splice(out.length - 1, 0, { type: 'text', value: match[1] });
    if (match[3] && !match[1]) out.push({ type: 'text', value: match[3] });
    last = start + match[0].length;
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
};

const rewriteText = (tree: MdNode, split: (value: string) => MdNode[] | null) => {
  const walk = (node: MdNode) => {
    if (!node.children || node.type === 'code' || node.type === 'inlineCode') return;
    node.children = node.children.flatMap((child) => {
      const parts = child.type === 'text' && child.value ? split(child.value) : null;
      return parts ?? [child];
    });
    node.children.forEach(walk);
  };
  walk(tree);
};

const remarkHighlight = () => (tree: MdNode) =>
  rewriteText(tree, (value) => (value.includes('==') ? splitHighlights(value) : null));

const remarkSoftBreaks = () => (tree: MdNode) =>
  rewriteText(tree, (value) =>
    value.includes('\n')
      ? value
          .split('\n')
          .flatMap((part, index): MdNode[] => [
            ...(index ? [{ type: 'break' }] : []),
            ...(part ? [{ type: 'text', value: part }] : [])
          ])
      : null
  );

const remarkChordLines = () => (tree: MdNode) => {
  let previousStructural = false;
  tree.children?.forEach((node) => {
    const only = node.children?.length === 1 ? node.children[0] : null;
    if (node.type !== 'paragraph' || only?.type !== 'text') {
      previousStructural = false;
      return;
    }
    const text = only.value ?? '';
    const chord = previousStructural && CHORD_LINE.test(text);
    if (chord) node.data = { hProperties: { className: ['markdown-chord'] } };
    previousStructural = chord || isStructuralLine(text);
  });
};

const BREAK_TAG = /<br\s*\/?>/i;

const withBreaks = (children: ReactNode) =>
  Children.map(children, (child) =>
    typeof child === 'string' && BREAK_TAG.test(child)
      ? child
          .split(/<br\s*\/?>/i)
          .flatMap((part, index) => (index ? [<br key={index} />, part] : [part]))
      : child
  );

const formatFileSize = (bytes: number, locale = 'en') => {
  const [unit, value] =
    bytes >= 1048576
      ? (['megabyte', bytes / 1048576] as const)
      : bytes >= 1024
        ? (['kilobyte', bytes / 1024] as const)
        : (['byte', bytes] as const);
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    maximumFractionDigits: unit === 'megabyte' ? 1 : 0
  }).format(value);
};

const FILENAME_ALT = /\.(png|jpe?g|gif|webp|avif|svg)$|%[0-9A-F]{2}/i;
const URL_TEXT = /^(?:https?:\/\/|www\.)\S+$/;

const childrenToText = (children: unknown): string => {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (isValidElement(children) && children.type === 'br') return '\n';
  if (children && typeof children === 'object' && 'props' in children) {
    return childrenToText((children as { props: { children?: unknown } }).props.children);
  }
  return '';
};

// https://github.com/remarkjs/react-markdown
export const Markdown = ({
  content,
  assetsPrefix,
  assetProxyBasePath,
  linksPrefix,
  disableLinks,
  disableInternalLinks,
  newTabLabel,
  linkLabels,
  headingLevelOffset = 0,
  tableLabel,
  codeLabel,
  locale,
  notesBasePath,
  currentDocIds,
  docIdByUrlId
}: {
  content: string;
  assetsPrefix?: string;
  assetProxyBasePath?: string;
  linksPrefix?: string;
  disableLinks?: string;
  disableInternalLinks?: boolean;
  newTabLabel?: string;
  linkLabels?: KnownLinkLabels;
  headingLevelOffset?: number;
  tableLabel?: string;
  codeLabel?: string;
  locale?: string;
  notesBasePath?: string;
  currentDocIds?: string[];
  docIdByUrlId?: Record<string, string>;
}) => {
  // Body copy is `lg`, so every heading level must sit strictly above it, and the top of
  // the ladder must not outsize the heading that encloses the markdown at that offset.
  const HEADING_SIZES: Record<number, readonly string[]> = {
    0: ['5xl', '4xl', '3xl', '2xl', 'xl', 'xl'],
    1: ['4xl', '3xl', '2xl', 'xl', 'xl', 'xl'],
    // Offset 2 nests markdown under an h2, so only two sizes sit above body copy (`lg`).
    // A third step is available because headings also carry the display face and heading
    // weight, so `lg` still reads as a heading against `lg` body text. Levels 4-6 collapse,
    // as they already do at offsets 0 and 1.
    2: ['2xl', 'xl', 'lg', 'lg', 'lg', 'lg']
  };
  const unescapedContent = content
    .split(CODE_SEGMENT)
    .map((segment, index) =>
      index % 2 === 1
        ? segment
        : segment
            .replace(/\\n/g, '\n')
            .replace(/\\\*\]\(([^)]+)\)/g, ']($1)*')
            .replace(/\\\*/g, '*')
            .replace(/(?<![^\s([])\*\*(\S[^*\n]*?)\s+\*\*/g, '**$1** ')
    )
    .join('');

  const slugger = createHeadingSlugger();

  const normalizedContent = unescapedContent
    .replace(FRONTMATTER, '')
    .split('\n')
    .map((line) =>
      line.replace(
        /^(\s*(?:[-*]\s+)?)((?:https?:\/\/|www\.)\S+)\s*$/,
        (_, prefix: string, url: string) => {
          const href = url.startsWith('www.') ? `https://${url}` : url;
          return /[<>]/.test(href)
            ? `${prefix}[${formatBareUrlLabel(url, undefined, linkLabels)}](${href})`
            : `${prefix}<${href}>`;
        }
      )
    )
    .join('\n');

  const knownLabels = linkLabels ?? defaultKnownLinkLabels;
  const labelUrls = new Map<string, string[]>();
  normalizedContent
    .split(CODE_SEGMENT)
    .filter((_, index) => index % 2 === 0)
    .forEach((segment) => {
      for (const [match] of segment.matchAll(RENDERED_URL)) {
        const url = match.replace(/[.,;:!?]+$/, '');
        const label = formatBareUrlLabel(url, undefined, knownLabels);
        const urls = labelUrls.get(label) ?? [];
        if (!urls.includes(url)) urls.push(url);
        labelUrls.set(label, urls);
      }
    });
  const numberLabel = (label: string, url: string) => {
    const urls = labelUrls.get(label);
    const position = urls ? urls.indexOf(url) : -1;
    return urls && urls.length > 1 && position >= 0
      ? knownLabels.numbered(label, position + 1)
      : label;
  };

  const resolveImageUrl = (rawUrl?: string) => {
    return resolveOutlineAssetUrl(rawUrl, {
      assetsPrefix,
      assetProxyBasePath
    });
  };

  const rankOf = makeRankOf(authoredHeadingLevels(normalizedContent));

  const headingSize = (level: number) =>
    (HEADING_SIZES[Math.min(2, headingLevelOffset)] ?? HEADING_SIZES[0])[
      Math.min(6, rankOf(level) + headingLevelOffset) - 1
    ];

  const headingAs = (level: number) =>
    `h${Math.min(6, Math.max(1, rankOf(level) + headingLevelOffset))}` as
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6';

  const heading =
    (level: 1 | 2 | 3 | 4 | 5 | 6) =>
    ({ node: _, ...props }: ComponentPropsWithoutRef<'h1'> & { node?: unknown }) => {
      const id = slugger(childrenToText(props.children));
      if (!childrenToText(props.children).trim()) return null;
      return (
        <Heading
          as={headingAs(level)}
          data-rank={rankOf(level)}
          id={id}
          fontSize={headingSize(level)}
          fontWeight={level === 5 ? 'bold' : undefined}
          lineHeight={level === 1 ? '1.1' : '1.15'}
          overflowWrap="anywhere"
          scrollMarginTop="24"
          {...props}
        />
      );
    };

  const rewriteOutlineHref = (href?: string) => {
    const local =
      assetsPrefix && href?.startsWith(`${assetsPrefix}/`) ? href.slice(assetsPrefix.length) : href;
    const share = local?.match(/^\/s\/([^/?#]+)(\/doc\/[^?#]+)?(#.*)?$/);
    if (share && notesBasePath)
      return `${notesBasePath}/${share[1]}${share[2] ?? ''}${share[3] ?? ''}`;
    const doc = local?.match(/^\/doc\/([^?#]+)(?:#(.*))?$/);
    if (!doc) return href;
    const [, slug, rawFragment] = doc;
    let fragment = '';
    if (rawFragment) {
      try {
        fragment = headingSlugBase(decodeURIComponent(rawFragment).replace(/^h-/, ''));
      } catch {
        fragment = '';
      }
    }
    const sameDocument = currentDocIds?.some((id) => slug === id || slug.endsWith(`-${id}`));
    if (sameDocument && fragment) return `#${fragment}`;
    const urlId = slug.split('-').pop() ?? slug;
    return `/doc/${docIdByUrlId?.[urlId] ?? slug}${fragment ? `#${fragment}` : ''}`;
  };

  return (
    <Stack
      gap="5"
      minW="0"
      maxW="full"
      lineHeight="1.8"
      overflowWrap="anywhere"
      css={{
        '& > :is(h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, hr):not(.markdown-structural)': {
          maxWidth: '42rem'
        },
        '& > [data-rank="1"]': { pt: '8' },
        '& > [data-rank="2"]': { pt: '6' },
        '& > [data-rank="3"], & > [data-rank="4"], & > [data-rank="5"], & > [data-rank="6"]': {
          pt: '3'
        },
        '& > [data-rank]:first-child': { pt: '0' }
      }}
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkTextr,
          remarkGfm,
          remarkCjkFriendly,
          remarkGemoji,
          remarkHighlight,
          remarkSoftBreaks,
          remarkChordLines
        ]}
        components={{
          h1: heading(1),
          h2: heading(2),
          h3: heading(3),
          h4: heading(4),
          h5: heading(5),
          h6: heading(6),
          p: ({ ref: _ref, node, ...props }) => {
            const text = childrenToText(props.children);
            // A trailing `\` is markdown's hard-break escape. When it ends up alone in its
            // own block it reaches the DOM as a visible backslash under the article.
            if (/^\\+$/.test(text.trim())) return null;
            const kids = (node as HastNode | undefined)?.children ?? [];
            const imageOnly =
              kids.some((child) => child.tagName === 'img') &&
              kids.every(
                (child) =>
                  child.tagName === 'img' || (child.type === 'text' && !child.value?.trim())
              );
            if (imageOnly) return <>{props.children}</>;
            if (isStructuralLine(text) || props.className?.includes('markdown-chord')) {
              return (
                <Text
                  as="p"
                  color="var(--atelier-fg)"
                  fontFamily="var(--font-code)"
                  fontSize="sm"
                  lineHeight="1.7"
                  overflowWrap="anywhere"
                  whiteSpace="pre-wrap"
                  {...props}
                  className="markdown-structural"
                />
              );
            }
            return (
              <Text
                as="p"
                color="var(--atelier-fg-muted)"
                fontSize="lg"
                lineHeight="1.8"
                overflowWrap="anywhere"
                {...props}
              />
            );
          },
          mark: ({ ref: _, node: __, ...props }) => (
            <styled.mark
              px="0.5"
              color="var(--atelier-accent-soft)"
              bg="var(--atelier-surface-highest)"
              {...props}
            />
          ),
          strong: ({ ref: _, node: __, ...props }) => (
            <Text as="span" fontWeight="bold" {...props} />
          ),
          a: ({ ref: _, node: __, ...props }) => {
            const { href: rawHref, children, ...rest } = props;
            const href = rewriteOutlineHref(rawHref);
            const dest = rawHref?.includes('attachments.redirect')
              ? resolveImageUrl(rawHref)
              : linksPrefix && href?.startsWith('/doc/')
                ? join(linksPrefix, href)
                : href;
            const childText = childrenToText(children).trim();
            const attachment = rawHref?.includes('attachments.redirect')
              ? childText.match(/^(.+?)\s+(\d+)$/)
              : null;
            const displayChildren = URL_TEXT.test(childText)
              ? numberLabel(formatBareUrlLabel(childText, undefined, knownLabels), childText)
              : attachment
                ? `${attachment[1]} · ${formatFileSize(Number(attachment[2]), locale)}`
                : children;
            if (!href?.trim()) {
              return <Text as="span">{children}</Text>;
            }
            if (disableLinks || (disableInternalLinks && href?.startsWith('/'))) {
              return <Text as="p">{props.children}</Text>;
            }
            const ownSite = dest?.match(/^https?:\/\/(?:www\.)?ham-san\.net(\/[^#?]*)?([?#].*)?$/i);
            const target = ownSite ? `${ownSite[1] || '/'}${ownSite[2] ?? ''}` : dest;
            const isExternal = !!target && !target.startsWith('#') && !target.startsWith('/');
            // Amber + bold on every inline link turned a body with twenty of them into
            // highlighter, and spent the system's one signal colour on prose. The hero and
            // project descriptions set links as body ink with a rule; this matches them and
            // keeps amber for the hover.
            return (
              <Link
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                href={target}
                display="inline"
                color="var(--atelier-fg)"
                textDecorationColor="var(--atelier-outline)"
                _hover={{
                  color: 'var(--atelier-accent)',
                  textDecorationColor: 'var(--atelier-accent)'
                }}
                {...rest}
              >
                {displayChildren}
                {isExternal && newTabLabel ? (
                  <styled.span srOnly> {newTabLabel}</styled.span>
                ) : null}
              </Link>
            );
          },
          hr: ({ ref: _, node: __, ...props }) => (
            <styled.hr
              borderTop="1px solid var(--atelier-line)"
              borderWidth="0"
              w="full"
              my="4"
              {...props}
            />
          ),
          blockquote: ({ ref: __, node: _, ...props }) => (
            <styled.blockquote
              borderLeftWidth="2px"
              borderLeftColor="var(--atelier-accent)"
              padding="5"
              color="var(--atelier-fg)"
              bg="var(--atelier-surface-low)"
              borderLeftStyle="solid"
              {...props}
            />
          ),
          ul: ({ ref: _, node: __, ...props }) => {
            const isTaskList = props.className?.includes('contains-task-list');
            return (
              <styled.ul
                pl={isTaskList ? '0' : '6'}
                color="var(--atelier-fg-muted)"
                fontSize="lg"
                listStyleType={isTaskList ? 'none' : 'disc'}
                css={{
                  '& > li + li': { marginTop: '0.75rem' },
                  '& li > :is(ul, ol)': { marginTop: '0.5rem' },
                  '& li > a': {
                    display: 'inline-block',
                    paddingBlock: '0.5rem',
                    marginBlock: '-0.5rem'
                  },
                  '& li > p': { fontSize: 'inherit', lineHeight: 'inherit', margin: '0' },
                  '& li:empty': { display: 'none' },
                  '& > li:has(> div:only-child > img)': {
                    listStyle: 'none',
                    marginInlineStart: '-1.5rem'
                  },
                  '& > li:has(> figure:only-child)': {
                    listStyle: 'none',
                    marginInlineStart: '-1.5rem'
                  },
                  '& input[type="checkbox"]': {
                    accentColor: 'var(--atelier-accent)',
                    opacity: '1',
                    marginInlineEnd: '0.5rem'
                  },
                  '& > li:has(> input:checked)': {
                    color: 'var(--atelier-outline)',
                    textDecoration: 'line-through'
                  },
                  '& > li:has(> p > input:checked)': {
                    color: 'var(--atelier-outline)',
                    textDecoration: 'line-through'
                  }
                }}
                {...props}
              />
            );
          },
          ol: ({ ref: _, node: __, ...props }) => (
            <styled.ol
              pl="6"
              color="var(--atelier-fg-muted)"
              fontSize="lg"
              listStyleType="decimal"
              css={{
                '& > li + li': { marginTop: '0.75rem' },
                '& li > :is(ul, ol)': { marginTop: '0.5rem' },
                '& li > a': {
                  display: 'inline-block',
                  paddingBlock: '0.5rem',
                  marginBlock: '-0.5rem'
                },
                '& li > p': { fontSize: 'inherit', lineHeight: 'inherit', margin: '0' },
                '& li:empty': { display: 'none' },
                '& > li:has(> div:only-child > img)': {
                  listStyle: 'none',
                  marginInlineStart: '-1.5rem'
                },
                '& > li:has(> figure:only-child)': {
                  listStyle: 'none',
                  marginInlineStart: '-1.5rem'
                }
              }}
              {...props}
            />
          ),
          li: ({ ref: _, node: __, ...props }) => <styled.li lineHeight="1.7" {...props} />,
          pre: ({ ref: _, node: __, children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            const codeProps = isValidElement<{ className?: string; children?: unknown }>(child)
              ? child.props
              : undefined;
            return (
              <styled.pre
                tabIndex={0}
                role={codeLabel ? 'region' : undefined}
                aria-label={codeLabel}
                border="1px solid"
                borderColor="var(--atelier-line)"
                maxW="full"
                p="5"
                color="var(--atelier-fg)"
                fontFamily="var(--font-code)"
                fontSize="sm"
                lineHeight="1.7"
                bg="var(--atelier-surface-low)"
                overflowX="auto"
                _focusVisible={{ outline: '2px solid var(--atelier-accent)', outlineOffset: '2px' }}
                css={{
                  backgroundPosition: 'left center, right center, left center, right center',
                  backgroundAttachment: 'local, local, scroll, scroll',
                  backgroundImage:
                    'linear-gradient(to right, var(--atelier-surface-low), var(--atelier-surface-low)), linear-gradient(to left, var(--atelier-surface-low), var(--atelier-surface-low)), linear-gradient(to right, var(--atelier-line), transparent), linear-gradient(to left, var(--atelier-line), transparent)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '2rem 100%, 2rem 100%, 0.75rem 100%, 0.75rem 100%'
                }}
              >
                <styled.code className={codeProps?.className}>
                  {codeProps ? childrenToText(codeProps.children).replace(/\n$/, '') : children}
                </styled.code>
              </styled.pre>
            );
          },
          code: ({ ref: _, node: __, className: ___, children, ...props }) => (
            <Code {...props}>{children}</Code>
          ),
          table: ({ ref: _, node: __, ...props }) => (
            <styled.div
              tabIndex={0}
              role="region"
              aria-label={tableLabel}
              w="full"
              overflowX="auto"
              _focusVisible={{ outline: '2px solid var(--atelier-accent)', outlineOffset: '2px' }}
              css={{
                '& table': { minW: '100%' },
                '& :is(td, th) div': { minH: 'auto', containIntrinsicSize: 'none' },
                '& :is(td, th) img': { maxW: '10rem', maxH: '8rem !important' },
                backgroundPosition: 'left center, right center, left center, right center',
                backgroundAttachment: 'local, local, scroll, scroll',
                backgroundImage:
                  'linear-gradient(to right, var(--atelier-bg), var(--atelier-bg)), linear-gradient(to left, var(--atelier-bg), var(--atelier-bg)), linear-gradient(to right, var(--atelier-line), transparent), linear-gradient(to left, var(--atelier-line), transparent)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '2rem 100%, 2rem 100%, 0.75rem 100%, 0.75rem 100%'
              }}
            >
              <Table.Root {...props} />
            </styled.div>
          ),
          thead: ({ ref: _, node: __, ...props }) =>
            childrenToText(props.children).trim() ? <Table.Head {...props} /> : null,
          th: ({ ref: _, node: __, ...props }) => (
            <Table.Header
              py="2"
              px="3"
              color="var(--atelier-outline)"
              fontFamily="var(--font-code)"
              fontSize="xs"
              letterSpacing="0.08em"
              textTransform="uppercase"
              {...props}
            >
              {withBreaks(props.children)}
            </Table.Header>
          ),
          tbody: ({ ref: _, node: __, ...props }) => (
            <Table.Body
              css={{
                '& tr:hover': {
                  bg: 'color-mix(in srgb, var(--atelier-surface-highest) 30%, transparent)'
                }
              }}
              {...props}
            />
          ),
          tr: ({ ref: _, node: __, ...props }) => <Table.Row {...props} />,
          td: ({ ref: _, node: __, ...props }) => (
            <Table.Cell
              py="2"
              px="3"
              color="var(--atelier-fg-muted)"
              fontSize="sm"
              css={{
                '& > a:only-child': {
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '44px',
                  minWidth: '44px'
                }
              }}
              {...props}
            >
              {withBreaks(props.children)}
            </Table.Cell>
          ),
          img: ({ ref: _, node: __, ...props }) => {
            const url = resolveImageUrl(props.src);
            const alt = props.alt?.trim() ?? '';
            const caption = FILENAME_ALT.test(alt) ? '' : alt;
            const plate = (
              <styled.div
                display="flex"
                justifyContent="center"
                alignItems="center"
                border="1px solid"
                borderColor="var(--atelier-line)"
                maxW="full"
                // CMS markdown carries no intrinsic dimensions, so nothing can reserve the
                // exact box. Width/height attributes reserve it but pin the ratio: measured
                // a 140x200 portrait rendered 538x302. A floor bounds the shift to the
                // difference from 220px rather than from zero, and distorts nothing.
                minH="220px"
                p="1"
                lineHeight="0"
                bg="var(--atelier-surface-lowest)"
                overflow="hidden"
                // Offscreen images are not laid out until they approach the viewport, and
                // the browser remembers each box's real size after first render, so the
                // reserved height converges on the true one instead of staying a guess.
                contentVisibility="auto"
                containIntrinsicSize="auto 420px"
              >
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    // `width: 100%` upscaled small images to the column width and made a
                    // 146px grid cell render a full-width box.
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }}
                />
              </styled.div>
            );
            if (!caption) return plate;
            return (
              <styled.figure display="flex" gap="2" flexDirection="column" maxW="full" m="0">
                {plate}
                <styled.figcaption
                  color="var(--atelier-outline)"
                  fontFamily="var(--font-code)"
                  fontSize="xs"
                  lineHeight="1.6"
                >
                  {URL_TEXT.test(caption) ? (
                    <Link
                      href={caption.startsWith('www.') ? `https://${caption}` : caption}
                      target="_blank"
                      rel="noreferrer"
                      color="inherit"
                    >
                      {formatBareUrlLabel(caption, undefined, knownLabels)}
                    </Link>
                  ) : (
                    caption
                  )}
                </styled.figcaption>
              </styled.figure>
            );
          }
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </Stack>
  );
};
