import type { HobbyLink } from '~/utils/hobby-content';

export type HobbyEmbedProps = {
  title?: string | null;
  description?: string;
  body?: string;
  images?: string[];
  links?: HobbyLink[];
  nestedPages?: Array<{ title: string; href: string }>;
  statusLabel?: string;
  moduleLabel?: string;
  moduleTitle?: string;
  moduleDescription?: string;
  updatedPrefix?: string;
  liveContentLabel?: string;
  emptySourceLabel?: string;
  nestedSourcePagesLabel?: string;
  sourceNoteAttachedLabel?: string;
  statusMetricLabel?: string;
  linksMetricLabel?: string;
  updatedMetricLabel?: string;
  pagesMetricLabel?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive';
};
