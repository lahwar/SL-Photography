interface ImportMetaEnv {
  /** Optional Plausible domain (e.g. "slphotography.com"). Analytics load only when set. */
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
