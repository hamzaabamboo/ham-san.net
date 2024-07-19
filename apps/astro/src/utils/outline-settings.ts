import { cleanArticleContent } from 'outline/article';
import { parseMarkdown } from 'utils/markdown';
import { outlineClient } from './outline-api';

import type { Link, Table, Text } from 'mdast';

export const getOutlineSettings = async () => {
  const events = await outlineClient.POST('/documents.info', {
    body: { id: import.meta.env.PRIVATE_OUTLINE_SETTINGS_DOCUMENT_ID }
  });

  const settingsContent = cleanArticleContent(events.data?.data?.text);

  if (!settingsContent) {
    return;
  }

  const tree = await parseMarkdown(settingsContent ?? '');

  const settings = Object.fromEntries(
    tree.children
      ?.find((c): c is Table => c.type === 'table')
      ?.children.slice(1)
      .map((c) => [
        (c.children[0].children[0] as Text)?.value,
        (c.children[1].children[0] as Link)?.url ?? (c.children[1].children[0] as Text)?.value
      ]) as [string, string][]
  );

  return settings;
};
