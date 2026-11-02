import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { portfolio } from "./src/config/portfolio.ts";
import { portfolioSite } from "./scripts/site.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "SITE_");
  // GitHub Pages supplies these values for both user sites and project repositories.
  const urlOverride = process.env.SITE_URL || env.SITE_URL;
  const siteUrl = urlOverride || portfolio.site.url || "http://localhost:8080";
  const basePath = process.env.SITE_BASE_PATH ?? env.SITE_BASE_PATH ?? portfolio.site.basePath;
  const sitePortfolio = {
    ...portfolio,
    site: {
      ...portfolio.site,
      title: portfolio.site.title || `${portfolio.profile.name} — ${portfolio.profile.role}`,
      description:
        portfolio.site.description ||
        `${portfolio.profile.name}. ${portfolio.profile.role}. ${portfolio.profile.tagline}`,
      url: siteUrl,
      customDomain: urlOverride
        ? new URL(siteUrl).hostname.endsWith(".github.io")
          ? ""
          : new URL(siteUrl).hostname
        : portfolio.site.customDomain,
      basePath: basePath ? `/${basePath.replace(/^\/+|\/+$/g, "")}/`.replace("//", "/") : "/",
    },
  };

  return {
    base: sitePortfolio.site.basePath,
    plugins: [react(), tailwindcss(), portfolioSite(sitePortfolio)],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: { host: "::", port: 8080 },
    build: {
      target: "es2020",
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [{ name: "motion", test: /node_modules\/(?:framer-motion|motion-)/ }],
          },
        },
      },
    },
  };
});
