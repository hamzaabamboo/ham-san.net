import { Middleware } from 'openapi-fetch';
import { createOutlineClient } from 'outline';

export const isOutlineEnabled =
  !!import.meta.env.PRIVATE_OUTLINE_SERVER && !!import.meta.env.PRIVATE_OUTLINE_API_TOKEN;

export function authMiddleware(token: string): Middleware {
  return {
    onRequest({ request }) {
      request.headers.append('Authorization', `Bearer ${token}`);
      return new Request(request, {redirect:"manual"});
    }
  };
}

export const outlineClient = createOutlineClient({
  baseUrl: (import.meta.env.PRIVATE_OUTLINE_SERVER ?? '') as 'https://app.getoutline.com/api'
});

outlineClient.use(authMiddleware(import.meta.env.PRIVATE_OUTLINE_API_TOKEN));
