/// <reference types="vite/client" />

declare const __PORTFOLIO_SITE__: import("./types/portfolio").PortfolioConfig["site"];

declare module "virtual:portfolio-images" {
  export const imageMetadata: Record<string, { width: number; height: number }>;
}
