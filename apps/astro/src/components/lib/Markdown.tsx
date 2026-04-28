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

// https://github.com/remarkjs/react-markdown
export const Markdown = ({
  content,
  assetsPrefix,
  assetProxyBasePath,
  linksPrefix,
  disableLinks,
  disableInternalLinks
}: {
  content: string;
  assetsPrefix?: string;
  assetProxyBasePath?: string;
  linksPrefix?: string;
  disableLinks?: string;
  disableInternalLinks?: boolean;
}) => {
  const formatBareUrlLabel = (rawUrl: string) => {
    const href = rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl;
    try {
      const url = new URL(href);
      return `Open ${url.hostname.replace(/^www\./, '')}`;
    } catch {
      return rawUrl;
    }
  };

  const normalizedContent = content
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
    if (!rawUrl) return rawUrl;
    if (/^(?:[a-z]+:)?\/\//i.test(rawUrl) || rawUrl.startsWith('data:')) {
      return rawUrl;
    }
    if (rawUrl.includes('attachments.redirect')) {
      const query = rawUrl.split('?')[1];
      const proxyBasePath = assetProxyBasePath ?? '/api/outline-asset';
      return query ? `${proxyBasePath}?${query}` : proxyBasePath;
    }
    if (!assetsPrefix) {
      return rawUrl;
    }

    const normalizedUrl = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl.replace(/^\.?\/*/, '')}`;

    return `${assetsPrefix}${normalizedUrl}`;
  };

  return (
    <Stack gap="5" minW="0" maxW="full" lineHeight="1.8">
      <ReactMarkdown
        remarkPlugins={[remarkTextr, remarkGfm]}
        components={{
          h1: ({ ref: __, node: _, ...props }) => (
            <Heading
              as="h1"
              fontSize="5xl"
              lineHeight="0.95"
              overflowWrap="anywhere"
              fontStyle="italic"
              {...props}
            />
          ),
          h2: ({ ref: __, node: _, ...props }) => (
            <Heading
              as="h2"
              pt="6"
              fontSize="4xl"
              overflowWrap="anywhere"
              fontStyle="italic"
              {...props}
            />
          ),
          h3: ({ ref: __, node: _, ...props }) => (
            <Heading as="h3" fontSize="3xl" overflowWrap="anywhere" fontStyle="italic" {...props} />
          ),
          h4: ({ ref: __, node: _, ...props }) => <Heading as="h4" fontSize="2xl" {...props} />,
          h5: ({ ref: __, node: _, ...props }) => (
            <Heading as="h5" fontSize="xl" fontWeight="bold" {...props} />
          ),
          h6: ({ ref: __, node: _, ...props }) => <Heading as="h6" fontSize="xl" {...props} />,
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
              <Link target="_blank" href={dest} fontWeight="bold" {...rest}>
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
                    filter: 'grayscale(1) contrast(1.25)',
                    mixBlendMode: 'luminosity'
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
