import { createClient, type ClientPlugin, type NormalizeOAS } from 'fets';
import type openAPIDoc from 'outline/spec';

export const isOutlineEnabled =
  !!import.meta.env.PRIVATE_OUTLINE_SERVER && !!import.meta.env.PRIVATE_OUTLINE_API_TOKEN;

export function useAuth(token: string): ClientPlugin {
  return {
    onRequestInit({ requestInit }) {
      requestInit.headers = {
        ...requestInit.headers,
        Authorization: `Bearer ${token}`
      };
      requestInit.redirect = 'manual';
    }
  };
}

export type OutlineAPI = NormalizeOAS<typeof openAPIDoc>;

export const outlineClient = createClient<OutlineAPI>({
  endpoint: (import.meta.env.PRIVATE_OUTLINE_SERVER ?? '') as 'https://app.getoutline.com/api',
  plugins: [useAuth(import.meta.env.PRIVATE_OUTLINE_API_TOKEN)]
});
