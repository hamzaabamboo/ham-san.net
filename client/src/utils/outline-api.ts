import { PRIVATE_OUTLINE_API_TOKEN, PRIVATE_OUTLINE_SERVER } from '$env/static/private';
import { createClient, type NormalizeOAS } from 'fets';
import type openAPIDoc from './outline-spec.json';

export const isOutlineEnabled = !!PRIVATE_OUTLINE_SERVER  && !!PRIVATE_OUTLINE_API_TOKEN
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const outlineClient = createClient<NormalizeOAS<typeof openAPIDoc>>({
  endpoint: PRIVATE_OUTLINE_SERVER  ?? '',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fetchFn: (input, init) => fetch(input, {...init, headers: { ...outlineHeader, ...init}})
})

export const outlineHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${PRIVATE_OUTLINE_API_TOKEN}`
}
