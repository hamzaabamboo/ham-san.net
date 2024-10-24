import { Code } from 'astro:components';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkTextr from 'remark-textr';
import { Divider, Stack, styled } from 'styled-system/jsx';
import { Heading } from '../ui/heading';
import { Link } from '../ui/link';
import { Table } from '../ui/table';
import { Text } from '../ui/text';

// https://github.com/remarkjs/react-markdown
export const Markdown = ({
  content,
  assetsPrefix,
  linksPrefix,
  disableLinks,
  disableInternalLinks
}: {
  content: string;
  assetsPrefix?: string;
  linksPrefix?: string;
  disableLinks?: string;
  disableInternalLinks?: boolean;
}) => {
  return (
    <Stack gap={2}>
      <ReactMarkdown
        remarkPlugins={[remarkTextr, remarkGfm]}
        components={{
          h1: ({ ref: __, node: _, ...props }) => (
            <Heading as="h1" size="3xl" fontWeight="bold" {...props} />
          ),
          h2: ({ ref: __, node: _, ...props }) => <Heading as="h2" size="3xl" {...props} />,
          h3: ({ ref: __, node: _, ...props }) => (
            <Heading as="h3" size="2xl" fontWeight="bold" {...props} />
          ),
          h4: ({ ref: __, node: _, ...props }) => <Heading as="h4" size="2xl" {...props} />,
          h5: ({ ref: __, node: _, ...props }) => (
            <Heading as="h5" size="xl" fontWeight="bold" {...props} />
          ),
          h6: ({ ref: __, node: _, ...props }) => <Heading as="h6" size="xl" {...props} />,
          p: ({ ref: _ref, node: _, ...props }) => <Text as="p" {...props} />,
          strong: ({ ref: _, node: __, ...props }) => (
            <Text as="span" fontWeight="bold" {...props} />
          ),
          a: ({ ref: _, node: __, ...props }) => {
            const { href, ...propsWithoutHref } = props;
            const dest = linksPrefix && href?.startsWith('/') ? join(linksPrefix, href) : href;
            if (disableLinks || (disableInternalLinks && href?.startsWith('/'))) {
              return <Text as="p">{props.children}</Text>;
            }
            return <Link target="_blank" fontWeight="bold" {...props} href={dest} />;
          },
          hr: ({ ref: _, node: __, ...props }) => <Divider {...props} />,
          blockquote: ({ ref: __, node: _, ...props }) => (
            <styled.blockquote
              borderLeftWidth="4px"
              borderLeftColor="border.default"
              padding={4}
              borderLeftStyle="solid"
              {...props}
            />
          ),
          ul: ({ ref: _, node: __, ...props }) => (
            <styled.ul pl="4" listStyleType="disc" {...props} />
          ),
          ol: ({ ref: _, node: __, ...props }) => (
            <styled.ol pl="4" listStyleType="decimal" {...props} />
          ),
          li: ({ ref: _, node: __, ...props }) => <styled.li {...props} />,
          code: ({ ref: _, node: __, lang, ...props }) => (
            <Code lang={lang as 'javascript'} code={props.children?.toString() ?? ''} />
          ),
          table: ({ ref: _, node: __, ...props }) => <Table.Root {...props} />,
          thead: ({ ref: _, node: __, ...props }) => <Table.Head {...props} />,
          th: ({ ref: _, node: __, ...props }) => <Table.Header {...props} />,
          tbody: ({ ref: _, node: __, ...props }) => <Table.Body {...props} />,
          tr: ({ ref: _, node: __, ...props }) => <Table.Row {...props} />,
          td: ({ ref: _, node: __, ...props }) => <Table.Cell {...props} />,
          img: ({ ref: _, node: __, ...props }) => {
            const rawUrl = props.src;
            const url = rawUrl?.[0] === '/' && assetsPrefix ? `${assetsPrefix}${rawUrl}` : rawUrl;
            return <img {...props} src={url} />;
          }
        }}
      >
        {/* {data} */}
        {content}
      </ReactMarkdown>
    </Stack>
  );
};
