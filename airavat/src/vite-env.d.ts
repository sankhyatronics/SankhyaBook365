/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Entra ID app (client) ID used by the Storybook MSAL sign-in. */
  readonly VITE_CLIENT_ID: string;
  /** JSON array of ISiteInfo used as handbook sources in Storybook. */
  readonly VITE_HANDBOOK_SOURCES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
