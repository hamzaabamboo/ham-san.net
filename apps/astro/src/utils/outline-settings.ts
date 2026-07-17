import { cleanArticleContent } from 'outline/article';
import { parseMarkdown } from 'utils/markdown';
import { withLastGood } from './cms-cache';
import { outlineClient, outlineSettingsDocumentId } from './outline-api';

import type { Link, Table, Text } from 'mdast';

export const getOutlineSettings = async () => {
  const events = await withLastGood(
    'outline:settings',
    async () => {
      const request = await outlineClient.POST('/documents.info', {
        body: { id: outlineSettingsDocumentId }
      });
      if (!request.response.ok) {
        throw new Error(`documents.info ${request.response.status}`);
      }
      return request;
    },
    (request) => request.response.ok
  );

  const settingsContent = cleanArticleContent(events.data?.data?.text);

  if (!settingsContent) {
    return;
  }

  const tree = await parseMarkdown(settingsContent ?? '');

  const settings = Object.fromEntries(
    tree.children
      ?.find((c: (typeof tree.children)[number]): c is Table => c.type === 'table')
      ?.children.slice(1)
      .map((c: Table['children'][number]) => [
        (c.children[0].children[0] as Text)?.value,
        (c.children[1].children[0] as Link)?.url ?? (c.children[1].children[0] as Text)?.value
      ]) as [string, string][]
  );

  return settings;
};
