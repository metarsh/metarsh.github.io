import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { Plugin } from "vite";
import type { PortfolioConfig } from "../src/types/portfolio.ts";

export const portfolioSite = (portfolio: PortfolioConfig): Plugin => {
  const escapeHtml = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
    );
  const basePath = portfolio.site.basePath;
  const siteUrl = `${portfolio.site.url.replace(/\/+$/, "")}/`;
  const assetPath = (value: string) =>
    /^https?:\/\//.test(value) ? value : `${basePath}${value.replace(/^\/+/, "")}`;
  const absoluteAsset = (value: string) =>
    /^https?:\/\//.test(value) ? value : new URL(value.replace(/^\/+/, ""), siteUrl).href;
  const socialImage = portfolio.site.socialImage || "social-card.png";

  const contentSecurityPolicy = (dev = false) => {
    const formOrigin = portfolio.contact.formEndpoint
      ? new URL(portfolio.contact.formEndpoint).origin
      : "";
    const recaptcha = portfolio.contact.recaptchaSiteKey
      ? "https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/"
      : "";
    return `default-src 'self'; base-uri 'self'; object-src 'none'; frame-src ${recaptcha || "'none'"}; media-src 'self' data: blob:; script-src 'self' ${recaptcha}${dev ? " 'unsafe-inline'" : ""}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https: data:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' ${formOrigin} ${recaptcha}${dev ? " ws://localhost:* ws://127.0.0.1:* ws://[::1]:*" : ""}; form-action 'self' ${formOrigin}; manifest-src 'self';`.replace(
      / +;/g,
      ";",
    );
  };

  const metadata = (dev: boolean) => {
    const { site, profile, socials } = portfolio;
    const meta = (name: string, content: string, property = false) =>
      `<meta ${property ? "property" : "name"}="${name}" content="${escapeHtml(content)}" />`;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${siteUrl}#person`,
          name: profile.name,
          alternateName: profile.username,
          url: siteUrl,
          image: absoluteAsset(profile.avatar),
          jobTitle: profile.role,
          description: site.description,
          sameAs: socials.map((social) => social.href),
          ...(profile.university
            ? { alumniOf: { "@type": "CollegeOrUniversity", name: profile.university } }
            : {}),
        },
        {
          "@type": "ProfilePage",
          "@id": `${siteUrl}#profilepage`,
          name: site.title,
          url: siteUrl,
          mainEntity: { "@id": `${siteUrl}#person` },
        },
      ],
    };
    return [
      `<title>${escapeHtml(site.title)}</title>`,
      meta("theme-color", site.themeColor),
      meta("description", site.description),
      meta("keywords", [profile.name, ...site.keywords].join(", ")),
      meta("author", profile.name),
      `<meta http-equiv="Content-Security-Policy" content="${escapeHtml(contentSecurityPolicy(dev))}" />`,
      `<link rel="icon" href="${escapeHtml(assetPath(site.favicon))}" />`,
      `<link rel="apple-touch-icon" href="${escapeHtml(assetPath(site.favicon))}" />`,
      `<link rel="canonical" href="${escapeHtml(siteUrl)}" />`,
      meta("og:type", "website", true),
      meta("og:locale", site.locale, true),
      meta("og:site_name", site.title, true),
      meta("og:title", site.title, true),
      meta("og:description", site.description, true),
      meta("og:url", siteUrl, true),
      meta("og:image", absoluteAsset(socialImage), true),
      meta("og:image:alt", `${profile.name} — ${profile.role}`, true),
      meta("twitter:card", "summary_large_image"),
      meta("twitter:title", site.title),
      meta("twitter:description", site.description),
      meta("twitter:image", absoluteAsset(socialImage)),
      ...(site.googleSiteVerification
        ? [meta("google-site-verification", site.googleSiteVerification)]
        : []),
      `<link rel="alternate" type="text/markdown" href="${basePath}llms.txt" title="LLM Context" />`,
      `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`,
    ].join("\n  ");
  };

  const crawlerContent = () => {
    const { profile, sections } = portfolio;
    const summary = `# ${profile.name}\n\n> ${profile.role}. ${profile.tagline}\n\n${portfolio.site.description}\n\n- [Portfolio](${siteUrl})\n- Email: ${profile.email}\n- Location: ${profile.location}\n\n## Profiles\n${portfolio.socials.map((social) => `- [${social.label}](${social.href})`).join("\n")}\n`;
    const parts = [summary];
    if (sections.about.enabled) parts.push(`## Education\n${portfolio.about.education}`);
    if (sections.work.enabled)
      parts.push(
        `## Projects\n${portfolio.projects.map((project) => `### [${project.title}](${project.link || project.botLink || project.sourceLink || siteUrl})\n${project.description}\n\nStack: ${project.tags.join(", ")}`).join("\n\n")}`,
      );
    if (sections.skills.enabled)
      parts.push(
        `## Skills\n${portfolio.skills.layers.map((layer) => `- ${layer.id}: ${layer.tools.map((tool) => tool.name).join(", ")}`).join("\n")}\nLanguages: ${portfolio.skills.languages.map((tool) => tool.name).join(", ")}`,
      );
    if (sections.research.enabled)
      parts.push(
        `## Publications\n${portfolio.publications.map((publication) => `- ${publication.title} — ${publication.venue}. ${publication.result}`).join("\n")}`,
      );
    if (sections.experience.enabled)
      parts.push(
        `## Experience\n${portfolio.experiences.map((experience) => `- ${experience.role} at ${experience.company} (${experience.timeframe})`).join("\n")}`,
      );
    if (sections.credentials.enabled)
      parts.push(
        `## Credentials\n${portfolio.credentials.map((credential) => `- ${credential.title} — ${credential.issuer} (${credential.issuedLabel})${credential.result ? `: ${credential.result}` : ""}`).join("\n")}`,
      );
    if (sections.insights.enabled)
      parts.push(
        `## Insight\n[${portfolio.insight.title}](${siteUrl}#/insights)\n${portfolio.insight.summary}`,
      );
    return { summary, full: `${parts.join("\n\n")}\n` };
  };

  const generatedFiles = () => {
    const { summary, full } = crawlerContent();
    return {
      "robots.txt": `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
      // HashRouter routes are fragments of the same document, so only the real URL belongs here.
      "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHtml(siteUrl)}</loc></url></urlset>\n`,
      "llms.txt": summary,
      "llms-full.txt": full,
      _headers: `/*\n  Content-Security-Policy: ${contentSecurityPolicy()}\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Cache-Control: public, max-age=0, must-revalidate\n\n${basePath}assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
      "404.html": `<!doctype html><html lang="${escapeHtml(portfolio.site.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found</title></head><body><p>Page not found. <a href="${escapeHtml(basePath)}">Return to ${escapeHtml(portfolio.site.title)}</a>.</p></body></html>\n`,
      ...(portfolio.site.customDomain ? { CNAME: `${portfolio.site.customDomain}\n` } : {}),
    };
  };

  const generateSocialImage = async () => {
    const { profile, site } = portfolio;
    const fontSize = Math.min(86, Math.floor((1000 / Math.max(profile.name.length, 1)) * 1.6));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${escapeHtml(site.themeColor)}"/><text x="100" y="295" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="white">${escapeHtml(profile.name)}</text><text x="100" y="370" font-family="sans-serif" font-size="32" fill="#a1a1aa">${escapeHtml(profile.role)}</text></svg>`;
    return sharp(Buffer.from(svg)).png().toBuffer();
  };

  let dev = false;
  let projectRoot = process.cwd();
  return {
    name: "portfolio-site",
    configResolved(config) {
      dev = config.command === "serve";
      projectRoot = config.root;
    },
    buildStart() {
      if (!basePath.startsWith("/") || !basePath.endsWith("/"))
        throw new Error("site.basePath must start and end with / (for example /portfolio/).");
      if (!/^https?:\/\//.test(portfolio.site.url))
        throw new Error("site.url must be an absolute http(s) URL.");
      if (portfolio.site.customDomain && !/^[a-z0-9.-]+$/i.test(portfolio.site.customDomain))
        throw new Error("site.customDomain must be a hostname without a protocol or path.");
      const mediaKeys = new Set([
        "favicon",
        "socialImage",
        "avatar",
        "src",
        "srcSm",
        "image",
        "imageSm",
        "ditherImage",
        "sprite",
      ]);
      const validateAssets = (value: unknown, key = "") => {
        if (
          typeof value === "string" &&
          value &&
          (mediaKeys.has(key) || key === "gallery") &&
          !/^https?:\/\//.test(value)
        ) {
          if (!fs.existsSync(path.join(projectRoot, "public", value.replace(/^\/+/, ""))))
            throw new Error(
              `Missing public asset: ${value}. Update src/config/portfolio.ts or add the file to public/.`,
            );
        } else if (Array.isArray(value)) value.forEach((item) => validateAssets(item, key));
        else if (value && typeof value === "object")
          Object.entries(value).forEach(([childKey, child]) => validateAssets(child, childKey));
      };
      validateAssets(portfolio);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html
          .replace('lang="en"', `lang="${escapeHtml(portfolio.site.language)}"`)
          .replace("<!-- portfolio:metadata -->", metadata(dev));
      },
    },
    configureServer(server) {
      // Vite bundles its config; changes to the imported portfolio config need a restart.
      server.watcher.add(path.join(projectRoot, "src/config/portfolio.ts"));
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        if (!pathname.startsWith(basePath)) return next();
        const name = pathname.slice(basePath.length);
        const files: Record<string, string> = generatedFiles();
        if (Object.hasOwn(files, name)) {
          res.setHeader(
            "Content-Type",
            name.endsWith(".xml")
              ? "application/xml"
              : name.endsWith(".html")
                ? "text/html"
                : "text/plain; charset=utf-8",
          );
          res.end(files[name]);
        } else if (name === "social-card.png" && !portfolio.site.socialImage) {
          res.setHeader("Content-Type", "image/png");
          try {
            res.end(await generateSocialImage());
          } catch (error) {
            next(error);
          }
        } else next();
      });
    },
    async generateBundle() {
      for (const [fileName, source] of Object.entries(generatedFiles()))
        this.emitFile({ type: "asset", fileName, source });
      if (!portfolio.site.socialImage)
        this.emitFile({
          type: "asset",
          fileName: "social-card.png",
          source: await generateSocialImage(),
        });
    },
  };
};
