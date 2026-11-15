import type { PortfolioConfig } from "../types/portfolio.ts";

export const pageMetadata = (portfolio: PortfolioConfig, pathname: string) => {
  const homeUrl = new URL(portfolio.site.basePath, portfolio.site.url).href;
  const article = pathname.replace(/\/$/, "") === "/insights";
  return {
    title: article
      ? `${portfolio.insight.title} | ${portfolio.profile.name}`
      : portfolio.site.title,
    description: article ? portfolio.insight.summary : portfolio.site.description,
    canonical: article ? new URL("insights/", homeUrl).href : homeUrl,
    type: article ? "article" : "website",
  };
};
