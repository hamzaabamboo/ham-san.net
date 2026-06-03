import type { HobbyLink } from '~/utils/hobby-content';

export type HobbyEmbedProps = {
  title?: string | null;
  description?: string;
  images?: string[];
  links?: HobbyLink[];
  updatedAt?: string;
  status?: 'active' | 'inactive';
};
