/** Resolve public/ assets on both a domain root and a GitHub Pages project path. */
export const assetUrl = (path: string) =>
  /^(?:https?:|data:|blob:)/.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
