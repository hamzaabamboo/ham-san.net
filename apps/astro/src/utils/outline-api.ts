import { Middleware } from 'openapi-fetch';
import { createOutlineClient } from 'outline';

const env = import.meta.env as Record<string, string | undefined>;
const getEnv = (key: string) => process.env[key] ?? env[key] ?? '';

export const outlineServerUrl = getEnv('PRIVATE_OUTLINE_SERVER');
export const outlineApiToken = getEnv('PRIVATE_OUTLINE_API_TOKEN');
export const outlineSettingsDocumentId = getEnv('PRIVATE_OUTLINE_SETTINGS_DOCUMENT_ID');
export const isOutlineEnabled = !!outlineServerUrl && !!outlineApiToken;

export function authMiddleware(token: string): Middleware {
  return {
    onRequest({ request }) {
      request.headers.append('Authorization', `Bearer ${token}`);
      return new Request(request, { redirect: 'manual' });
    }
  };
}

export const outlineClient = createOutlineClient({
  baseUrl: outlineServerUrl as 'https://app.getoutline.com/api'
});

outlineClient.use(authMiddleware(outlineApiToken));
