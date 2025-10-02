/// <reference types="vite/client" />

// Add PostHog environment variables
interface ImportMetaEnv {
  readonly VITE_PUBLIC_POSTHOG_KEY: string;
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
