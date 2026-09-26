import { authoredHeadingLevels, FRONTMATTER, makeRankOf } from '~/utils/heading-rank';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkTextr from 'remark-textr';
import { Divider, Stack, styled } from 'styled-system/jsx';
import { Code } from '../ui/code';
import { Heading } from '../ui/heading';
import { Link } from '../ui/link';
import { Table } from '../ui/table';
import { Text } from '../ui/text';
import { formatBareUrlLabel } from '~/utils/link-label';
import { resolveOutlineAssetUrl } from '~/utils/outline-assets';

export const createHeadingSlugger = () => {
  const counts = new Map<string, number>();
  let index = 0;
  return (text: string) => {
    index += 1;
    const base = text
      .toLowerCase()
      .trim()
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`[\]#]/g, '')
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
    const slug = base || `heading-${index}`;
    const seen = counts.get(slug) ?? 0;
    counts.set(slug, seen + 1);
    return seen === 0 ? slug : `${slug}-${seen}`;
  };
};

// A chord chart or tab written in Outline arrives as ordinary paragraphs, one per line, so
// it was set in Manrope at a 52px pitch — the bar columns did not line up and a two-screen
// chart became five. Two shapes only, both unambiguous and neither reachable from prose:
// a line GFM would have made a table row if it had carried a delimiter row (`| E | F#m |`),
// and a bracketed section label (`[Intro]`). Anything else stays prose.
const STRUCTURAL_LINE = /^\s*(?:\|.*|\[[^\]]+\])\s*$/;
// `.` does not match a newline and `$` is end-of-string here, so a soft-wrapped paragraph
// that merely opens with a pipe already fails the test — no separate line-count check.
export const isStructuralLine = (text: string) => STRUCTURAL_LINE.test(text);

const childrenToText = (children: unknown): string => {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
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
  headingLevelOffset = 0
}: {
  content: string;
  assetsPrefix?: string;
  assetProxyBasePath?: string;
  linksPrefix?: string;
  disableLinks?: string;
  disableInternalLinks?: boolean;
  headingLevelOffset?: number;
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
    .split(/(```[\s\S]*?```|`[^`\n]*`)/)
    .map((segment, index) =>
      index % 2 === 1
        ? segment
        : segment
            .replace(/\\n/g, '\n')
            .replace(/\\\*\]\(([^)]+)\)/g, ']($1)*')
            .replace(/\\\*/g, '*')
    )
    .join('');

  const slugger = createHeadingSlugger();

  const normalizedContent = unescapedContent
    .replace(FRONTMATTER, '')
    .split('\n')
    .map((line) =>
      line.replace(
        /^(\s*(?:[-*]\s+)?)((?:https?:\/\/|www\.)\S+)\s*$/,
        (_, prefix: string, url: string) =>
          `${prefix}[${formatBareUrlLabel(url)}](${url.startsWith('www.') ? `https://${url}` : url})`
      )
    )
    .join('\n');

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

  return (
    <Stack gap="5" minW="0" maxW="full" lineHeight="1.8">
      <ReactMarkdown
        remarkPlugins={[remarkTextr, remarkGfm]}
        components={{
          h1: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(1)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingSize(1)}
              lineHeight="0.95"
              overflowWrap="anywhere"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h2: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(2)}
              id={slugger(childrenToText(props.children))}
              pt="6"
              fontSize={headingSize(2)}
              overflowWrap="anywhere"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h3: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(3)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingSize(3)}
              overflowWrap="anywhere"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h4: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(4)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingSize(4)}
              scrollMarginTop="24"
              {...props}
            />
          ),
          h5: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(5)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingSize(5)}
              fontWeight="bold"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h6: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(6)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingSize(6)}
              scrollMarginTop="24"
              {...props}
            />
          ),
          p: ({ ref: _ref, node: _, ...props }) => {
            const text = childrenToText(props.children);
            // A trailing `\` is markdown's hard-break escape. When it ends up alone in its
            // own block it reaches the DOM as a visible backslash under the article.
            if (/^\\+$/.test(text.trim())) return null;
            if (isStructuralLine(text)) {
              return (
                <Text
                  as="p"
                  className="markdown-structural"
                  color="var(--atelier-fg)"
                  fontFamily="var(--font-code)"
                  fontSize="sm"
                  lineHeight="1.7"
                  overflowWrap="anywhere"
                  whiteSpace="pre-wrap"
                  {...props}
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
          strong: ({ ref: _, node: __, ...props }) => (
            <Text as="span" fontWeight="bold" {...props} />
          ),
          a: ({ ref: _, node: __, ...props }) => {
            const { href, children, ...rest } = props;
            const dest = linksPrefix && href?.startsWith('/') ? join(linksPrefix, href) : href;
            const childText = Array.isArray(children)
              ? children.join('')
              : typeof children === 'string'
                ? children
                : null;
            const displayChildren =
              childText && /^(?:https?:\/\/|www\.)/.test(childText.trim())
                ? formatBareUrlLabel(childText.trim())
                : children;
            if (disableLinks || (disableInternalLinks && href?.startsWith('/'))) {
              return <Text as="p">{props.children}</Text>;
            }
            const isExternal = !!dest && !dest.startsWith('#') && !dest.startsWith('/');
            // Amber + bold on every inline link turned a body with twenty of them into
            // highlighter, and spent the system's one signal colour on prose. The hero and
            // project descriptions set links as body ink with a rule; this matches them and
            // keeps amber for the hover.
            return (
              <Link
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                href={dest}
                color="var(--atelier-fg)"
                textDecorationColor="var(--atelier-outline)"
                _hover={{
                  color: 'var(--atelier-accent)',
                  textDecorationColor: 'var(--atelier-accent)'
                }}
                {...rest}
              >
                {displayChildren}
              </Link>
            );
          },
          hr: ({ ref: _, node: __, ...props }) => (
            <Divider borderColor="var(--atelier-line)" my="4" {...props} />
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
          ul: ({ ref: _, node: __, ...props }) => (
            <styled.ul
              pl="6"
              color="var(--atelier-fg-muted)"
              listStyleType="disc"
              css={{ '& > li + li': { marginTop: '0.5rem' } }}
              {...props}
            />
          ),
          ol: ({ ref: _, node: __, ...props }) => (
            <styled.ol
              pl="6"
              color="var(--atelier-fg-muted)"
              listStyleType="decimal"
              css={{ '& > li + li': { marginTop: '0.5rem' } }}
              {...props}
            />
          ),
          li: ({ ref: _, node: __, ...props }) => <styled.li lineHeight="1.7" {...props} />,
          code: ({ ref: _, node: __, className, children, ...props }) => {
            const language = className?.replace('language-', '');
            const content = children?.toString() ?? '';
            if (!language) {
              return <Code {...props}>{content}</Code>;
            }
            return (
              <styled.pre
                border="1px solid"
                borderColor="var(--atelier-line)"
                p="5"
                bg="var(--atelier-surface-low)"
                overflowX="auto"
              >
                <styled.code className={className}>{content}</styled.code>
              </styled.pre>
            );
          },
          table: ({ ref: _, node: __, ...props }) => (
            <styled.div w="full" overflowX="auto" css={{ '& table': { minW: 'max-content' } }}>
              <Table.Root {...props} />
            </styled.div>
          ),
          thead: ({ ref: _, node: __, ...props }) => <Table.Head {...props} />,
          th: ({ ref: _, node: __, ...props }) => (
            <Table.Header
              borderBottomColor="var(--atelier-line)"
              py="2"
              px="3"
              color="var(--atelier-outline)"
              fontFamily="var(--font-code)"
              fontSize="xs"
              letterSpacing="0.08em"
              textTransform="uppercase"
              {...props}
            />
          ),
          tbody: ({ ref: _, node: __, ...props }) => <Table.Body {...props} />,
          tr: ({ ref: _, node: __, ...props }) => (
            <Table.Row
              borderBottomColor="var(--atelier-line)"
              _hover={{ bg: 'rgba(53,53,52,0.3)' }}
              {...props}
            />
          ),
          td: ({ ref: _, node: __, ...props }) => (
            <Table.Cell py="2" px="3" color="var(--atelier-fg-muted)" fontSize="sm" {...props} />
          ),
          img: ({ ref: _, node: __, ...props }) => {
            const url = resolveImageUrl(props.src);
            return (
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
                  alt={props.alt}
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
          }
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </Stack>
  );
};
