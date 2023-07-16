import { PRIVATE_OUTLINE_API_TOKEN, PRIVATE_OUTLINE_SERVER } from '$env/static/private';
import { createClient, type ClientPlugin, type NormalizeOAS } from 'fets';
import type openAPIDoc from './outline-spec';

export const isOutlineEnabled = !!PRIVATE_OUTLINE_SERVER  && !!PRIVATE_OUTLINE_API_TOKEN

export function useAuth(token: string): ClientPlugin {
  return {
    onRequestInit({ requestInit }) {
      requestInit.headers = {
        ...requestInit.headers,
        Authorization: `Bearer ${token}`
      }
    }
  }
}

export type OutlineAPI = NormalizeOAS<typeof openAPIDoc>

export const outlineClient = createClient<OutlineAPI>({
  endpoint: (PRIVATE_OUTLINE_SERVER ?? '') as any,
  plugins: [useAuth(PRIVATE_OUTLINE_API_TOKEN)]
})
