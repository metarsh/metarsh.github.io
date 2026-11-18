import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { portfolio } from "./src/config/portfolio.ts";
import { portfolioSite } from "./scripts/site.ts";

const separateNotFoundSticker: Plugin = {
  name: "separate-not-found-sticker",
  apply: "build",
  enforce: "pre",
  async resolveId(id, importer) {
    if (id !== "stick-it-up" || !importer?.endsWith("/src/pages/NotFound.tsx")) return;
    // Give the 404 a separate module so its embedded portrait stays off the homepage.
    const resolved = await this.resolve(id, importer);
    if (resolved) return { ...resolved, id: `${resolved.id}?not-found` };
  },
};

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
    define: { __PORTFOLIO_SITE__: JSON.stringify(sitePortfolio.site) },
    plugins: [react(), tailwindcss(), separateNotFoundSticker, portfolioSite(sitePortfolio)],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: { host: "::", port: 8080 },
    build: {
      target: "es2020",
      rolldownOptions: {
        input: {
          index: fileURLToPath(new URL("./index.html", import.meta.url)),
          "404": fileURLToPath(new URL("./404.html", import.meta.url)),
        },
        output: {
          codeSplitting: {
            groups: [{ name: "motion", test: /node_modules\/(?:framer-motion|motion-)/ }],
          },
        },
      },
    },
  };
});
