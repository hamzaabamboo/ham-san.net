/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly PRIVATE_BACKEND_API_URL: string;
  readonly PRIVATE_OUTLINE_SERVER: string;
  readonly PRIVATE_OUTLINE_API_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
