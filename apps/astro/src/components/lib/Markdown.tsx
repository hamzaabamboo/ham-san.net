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
  openLinkLabel = 'Open',
  headingLevelOffset = 0
}: {
  content: string;
  assetsPrefix?: string;
  assetProxyBasePath?: string;
  linksPrefix?: string;
  disableLinks?: string;
  disableInternalLinks?: boolean;
  openLinkLabel?: string;
  headingLevelOffset?: number;
}) => {
  const headingAs = (level: number) =>
    `h${Math.min(6, Math.max(1, level + headingLevelOffset))}` as
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6';

  const toHttpHref = (rawUrl: string) => (rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl);

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

  const autoLabeledUrls = [
    ...Array.from(
      unescapedContent.matchAll(/^\s*(?:[-*]\s+)?((?:https?:\/\/|www\.)\S+)\s*$/gm),
      (match) => match[1]
    ),
    ...Array.from(
      unescapedContent.matchAll(/(?<!!)\[((?:https?:\/\/|www\.)[^\]\s]+)\]\(/g),
      (match) => match[1]
    ),
    ...Array.from(
      unescapedContent.matchAll(/<((?:https?:\/\/|www\.)[^>\s]+)>/g),
      (match) => match[1]
    )
  ];
  const hostGroups = new Map<string, Set<string>>();
  for (const rawUrl of autoLabeledUrls) {
    try {
      const href = toHttpHref(rawUrl);
      const host = new URL(href).hostname.replace(/^www\./, '');
      const group = hostGroups.get(host) ?? new Set<string>();
      group.add(href);
      hostGroups.set(host, group);
    } catch {
      continue;
    }
  }

  const autoLabelDetails = new Map<string, string>();
  for (const group of hostGroups.values()) {
    const hrefs = Array.from(group);
    if (hrefs.length < 2) continue;
    const segmentLists = hrefs.map((href) => new URL(href).pathname.split('/').filter(Boolean));
    const maxDepth = Math.max(...segmentLists.map((segments) => segments.length));
    let depth = 0;
    for (let level = 0; level < maxDepth; level += 1) {
      if (new Set(segmentLists.map((segments) => segments[level] ?? '')).size > 1) {
        depth = level;
        break;
      }
    }
    hrefs.forEach((href, index) => {
      const segment = segmentLists[index][depth] ?? segmentLists[index][0];
      if (!segment) return;
      const shortSegment = segment.length > 12 ? `${segment.slice(0, 10)}…` : segment;
      autoLabelDetails.set(href, depth > 0 ? `/…/${shortSegment}` : `/${shortSegment}`);
    });
  }

  const formatBareUrlLabel = (rawUrl: string) => {
    const href = toHttpHref(rawUrl);
    try {
      const host = new URL(href).hostname.replace(/^www\./, '');
      return `${openLinkLabel} ${host}${autoLabelDetails.get(href) ?? ''}`;
    } catch {
      return rawUrl;
    }
  };

  const slugger = createHeadingSlugger();

  const normalizedContent = unescapedContent
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

  return (
    <Stack gap="5" minW="0" maxW="full" lineHeight="1.8">
      <ReactMarkdown
        remarkPlugins={[remarkTextr, remarkGfm]}
        components={{
          h1: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(1)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingLevelOffset > 0 ? '4xl' : '5xl'}
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
              fontSize={headingLevelOffset > 0 ? '3xl' : '4xl'}
              overflowWrap="anywhere"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h3: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(3)}
              id={slugger(childrenToText(props.children))}
              fontSize={headingLevelOffset > 0 ? '2xl' : '3xl'}
              overflowWrap="anywhere"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h4: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(4)}
              id={slugger(childrenToText(props.children))}
              fontSize="2xl"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h5: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(5)}
              id={slugger(childrenToText(props.children))}
              fontSize="xl"
              fontWeight="bold"
              scrollMarginTop="24"
              {...props}
            />
          ),
          h6: ({ ref: __, node: _, ...props }) => (
            <Heading
              as={headingAs(6)}
              id={slugger(childrenToText(props.children))}
              fontSize="xl"
              scrollMarginTop="24"
              {...props}
            />
          ),
          p: ({ ref: _ref, node: _, ...props }) => (
            <Text
              as="p"
              color="#c7c6c6"
              fontSize="lg"
              lineHeight="1.8"
              overflowWrap="anywhere"
              {...props}
            />
          ),
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
            return (
              <Link
                target="_blank"
                href={dest}
                color="#ffd597"
                fontWeight="bold"
                textDecorationColor="rgba(255, 176, 0, 0.55)"
                _hover={{ color: '#ffb000', textDecorationColor: '#ffb000' }}
                {...rest}
              >
                {displayChildren}
              </Link>
            );
          },
          hr: ({ ref: _, node: __, ...props }) => (
            <Divider borderColor="#524533" my="4" {...props} />
          ),
          blockquote: ({ ref: __, node: _, ...props }) => (
            <styled.blockquote
              borderLeftWidth="2px"
              borderLeftColor="#ffb000"
              padding="5"
              color="#e5e2e1"
              bg="#1c1b1b"
              borderLeftStyle="solid"
              {...props}
            />
          ),
          ul: ({ ref: _, node: __, ...props }) => (
            <styled.ul
              pl="6"
              color="#c7c6c6"
              listStyleType="disc"
              css={{ '& > li + li': { marginTop: '0.5rem' } }}
              {...props}
            />
          ),
          ol: ({ ref: _, node: __, ...props }) => (
            <styled.ol
              pl="6"
              color="#c7c6c6"
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
                borderColor="#524533"
                p="5"
                bg="#1c1b1b"
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
              borderBottomColor="#524533"
              py="2"
              px="3"
              color="#9f8e78"
              fontFamily="JetBrains Mono, monospace"
              fontSize="xs"
              letterSpacing="0.08em"
              textTransform="uppercase"
              {...props}
            />
          ),
          tbody: ({ ref: _, node: __, ...props }) => <Table.Body {...props} />,
          tr: ({ ref: _, node: __, ...props }) => (
            <Table.Row
              borderBottomColor="#524533"
              _hover={{ bg: 'rgba(53,53,52,0.3)' }}
              {...props}
            />
          ),
          td: ({ ref: _, node: __, ...props }) => (
            <Table.Cell py="2" px="3" color="#c7c6c6" fontSize="sm" {...props} />
          ),
          img: ({ ref: _, node: __, ...props }) => {
            const url = resolveImageUrl(props.src);
            return (
              <styled.div
                border="1px solid"
                borderColor="#524533"
                maxW="full"
                p="1"
                overflow="hidden"
              >
                <img
                  src={url}
                  alt={props.alt}
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    filter: 'saturate(1.08) contrast(1.04)'
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
