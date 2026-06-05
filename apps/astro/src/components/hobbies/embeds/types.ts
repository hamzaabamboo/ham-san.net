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
  updatedPrefix?: string;
  liveContentLabel?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive';
};
