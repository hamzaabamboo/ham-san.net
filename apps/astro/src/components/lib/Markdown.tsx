import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkTextr from 'remark-textr';
import { Divider, styled } from 'styled-system/jsx';
import { Code } from '../ui/code';
import { Heading } from '../ui/heading';
import { Link } from '../ui/link';
import * as Table from '../ui/table';
import { Text } from '../ui/text';
// https://github.com/remarkjs/react-markdown
export const Markdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkTextr, remarkGfm]}
      components={{
        h1: ({ node: _, ...props }) => <Heading as="h1" size="6xl" fontWeight="bold" {...props} />,
        h2: ({ node: _, ...props }) => <Heading as="h2" size="5xl" fontWeight="bold" {...props} />,
        h3: ({ node: _, ...props }) => <Heading as="h3" size="4xl" fontWeight="bold" {...props} />,
        h4: ({ node: _, ...props }) => <Heading as="h4" size="3xl" fontWeight="bold" {...props} />,
        h5: ({ node: _, ...props }) => <Heading as="h5" size="2xl" fontWeight="bold" {...props} />,
        h6: ({ node: _, ...props }) => <Heading as="h6" size="xl" fontWeight="bold" {...props} />,
        p: ({ node: _, ...props }) => <Text as="p" {...props} />,
        strong: ({ ref: _, node: __, ...props }) => <Text as="span" fontWeight="bold" {...props} />,
        a: ({ ref: _, node: __, ...props }) => <Link {...props} />,
        hr: ({ ref: _, node: __, ...props }) => <Divider {...props} />,
        blockquote: ({ ref: __, node: _, ...props }) => (
          <styled.blockquote
            borderLeftWidth="4px"
            borderLeftStyle="solid"
            borderLeftColor="border.default"
            padding={4}
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
        code: ({ ref: _, node: __, ...props }) => <Code {...props} />,
        table: ({ ref: _, node: __, ...props }) => <Table.Root {...props} />,
        thead: ({ ref: _, node: __, ...props }) => <Table.Head {...props} />,
        th: ({ ref: _, node: __, ...props }) => <Table.Header {...props} />,
        tbody: ({ ref: _, node: __, ...props }) => <Table.Body {...props} />,
        tr: ({ ref: _, node: __, ...props }) => <Table.Row {...props} />,
        td: ({ ref: _, node: __, ...props }) => <Table.Cell {...props} />
      }}
    >
      {/* {data} */}
      {content}
    </ReactMarkdown>
  );
};
