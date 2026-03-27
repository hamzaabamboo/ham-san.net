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
    <Stack gap="5" lineHeight="1.8">
      <ReactMarkdown
        remarkPlugins={[remarkTextr, remarkGfm]}
        components={{
          h1: ({ ref: __, node: _, ...props }) => (
            <Heading as="h1" fontSize="5xl" lineHeight="0.95" fontStyle="italic" {...props} />
          ),
          h2: ({ ref: __, node: _, ...props }) => (
            <Heading as="h2" fontSize="4xl" pt="6" fontStyle="italic" {...props} />
          ),
          h3: ({ ref: __, node: _, ...props }) => (
            <Heading as="h3" fontSize="3xl" fontStyle="italic" {...props} />
          ),
          h4: ({ ref: __, node: _, ...props }) => <Heading as="h4" fontSize="2xl" {...props} />,
          h5: ({ ref: __, node: _, ...props }) => (
            <Heading as="h5" fontSize="xl" fontWeight="bold" {...props} />
          ),
          h6: ({ ref: __, node: _, ...props }) => <Heading as="h6" fontSize="xl" {...props} />,
          p: ({ ref: _ref, node: _, ...props }) => (
            <Text as="p" color="fg.muted" fontSize="lg" lineHeight="1.8" {...props} />
          ),
          strong: ({ ref: _, node: __, ...props }) => (
            <Text as="span" fontWeight="bold" {...props} />
          ),
          a: ({ ref: _, node: __, ...props }) => {
            const { href, children, ...rest } = props;
            const dest = linksPrefix && href?.startsWith('/') ? join(linksPrefix, href) : href;
            if (disableLinks || (disableInternalLinks && href?.startsWith('/'))) {
              return <Text as="p">{props.children}</Text>;
            }
            return (
              <Link target="_blank" href={dest} fontWeight="bold" {...rest}>
                {children as string}
              </Link>
            );
          },
          hr: ({ ref: _, node: __, ...props }) => (
            <Divider borderColor="border.subtle" my="4" {...props} />
          ),
          blockquote: ({ ref: __, node: _, ...props }) => (
            <styled.blockquote
              borderLeftWidth="2px"
              borderLeftColor="amber.500"
              padding="5"
              color="fg.default"
              bg="bg.default"
              borderLeftStyle="solid"
              {...props}
            />
          ),
          ul: ({ ref: _, node: __, ...props }) => (
            <styled.ul pl="6" color="fg.muted" listStyleType="disc" {...props} />
          ),
          ol: ({ ref: _, node: __, ...props }) => (
            <styled.ol pl="6" color="fg.muted" listStyleType="decimal" {...props} />
          ),
          li: ({ ref: _, node: __, ...props }) => <styled.li {...props} />,
          code: ({ ref: _, node: __, className, children, ...props }) => {
            const language = className?.replace('language-', '');
            const content = children?.toString() ?? '';
            if (!language) {
              return <Code {...props}>{content}</Code>;
            }
            return (
              <styled.pre
                border="1px solid"
                borderColor="border.subtle"
                p="5"
                bg="bg.default"
                overflowX="auto"
              >
                <styled.code className={className}>{content}</styled.code>
              </styled.pre>
            );
          },
          table: ({ ref: _, node: __, ...props }) => <Table.Root {...props} />,
          thead: ({ ref: _, node: __, ...props }) => <Table.Head {...props} />,
          th: ({ ref: _, node: __, ...props }) => <Table.Header {...props} />,
          tbody: ({ ref: _, node: __, ...props }) => <Table.Body {...props} />,
          tr: ({ ref: _, node: __, ...props }) => <Table.Row {...props} />,
          td: ({ ref: _, node: __, ...props }) => <Table.Cell {...props} />,
          img: ({ ref: _, node: __, ...props }) => {
            const url = resolveImageUrl(props.src);
            return <img src={url} alt={props.alt} style={{ width: '100%' }} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </Stack>
  );
};
