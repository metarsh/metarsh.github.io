import { MessageCircle, Globe, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { assetUrl } from "@/lib/assets";
import type { Project } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { lazy, Suspense, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import type { LightboxSlide } from "@/components/ProjectImageLightbox";
import { TechLogo } from "@/components/TechLogo";
import { imageMetadata } from "virtual:portfolio-images";
const ProjectImageLightbox = lazy(() =>
  import("@/components/ProjectImageLightbox").then((module) => ({
    default: module.ProjectImageLightbox,
  })),
);
const ProjectDialog = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus({ ref: dialogRef, open: true, onClose, suspended: lightboxIndex !== null });
  const slides = useMemo<LightboxSlide[]>(() => {
    const list: LightboxSlide[] = [];
    const seen = new Set<string>();

    const add = (src?: string) => {
      if (!src || seen.has(src)) return;
      seen.add(src);
      list.push({ src: assetUrl(src), alt: project.title, ...imageMetadata[src] });
    };

    if (project.gallery) {
      project.gallery.forEach(add);
    }
    add(project.image);

    return list;
  }, [project]);
  const hasMedia = slides.length > 0;

  return createPortal(
    <div data-modal-root>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          ref={dialogRef}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-[#0c0c12] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-sans"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-muted-foreground hover:text-white backdrop-blur-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto overscroll-contain lg:overflow-hidden">
            {hasMedia && (
              <div className="w-full lg:w-[48%] xl:w-[50%] bg-[#08080c] border-b lg:border-b-0 lg:border-r border-white/10 lg:overflow-y-auto lg:overscroll-contain shrink-0 lg:shrink p-4 sm:p-6 lg:p-8 space-y-5">
                {slides.map((slide, index) => (
                  <button
                    type="button"
                    key={slide.src}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`${project.title} preview`}
                    className="block w-full rounded-xl overflow-hidden border border-white/10 hover:border-white/25 bg-[#121218] shadow-xl cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.03] border-b border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                    <img
                      src={slide.src}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      width={slide.width}
                      height={slide.height}
                      className="w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div
              className={`w-full ${hasMedia ? "lg:w-[52%] xl:w-[50%]" : ""} bg-[#0c0c12] lg:overflow-y-auto lg:overscroll-contain shrink-0 lg:shrink p-6 sm:p-8 lg:p-10 space-y-6 font-sans`}
            >
              <div className="pr-10 sm:pr-12">
                <h2
                  id="project-modal-title"
                  className="text-3xl sm:text-4xl font-serif tracking-tight gradient-heading"
                >
                  {project.title}
                </h2>
                <p className="text-sm text-zinc-300 font-sans font-normal mt-1 leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              <div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-sans font-medium text-zinc-200"
                    >
                      <TechLogo name={tag} className="w-3.5 h-3.5 shrink-0" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {(project.link || project.botLink || project.sourceLink) && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {project.link && (
                    <Button
                      asChild
                      size="sm"
                      className="h-10 gap-1.5 px-4 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-sans text-xs font-medium transition-colors border-0"
                    >
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} - Live site (opens in a new tab)`}
                      >
                        <Globe className="h-3.5 w-3.5" aria-hidden="true" /> Live site
                      </a>
                    </Button>
                  )}

                  {project.botLink && (
                    <Button
                      asChild
                      variant={project.link ? "outline" : "default"}
                      size="sm"
                      className={`h-10 gap-1.5 px-4 rounded-full font-sans text-xs font-medium transition-colors ${
                        project.link
                          ? "border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white"
                          : "border-0 bg-white text-zinc-950 hover:bg-zinc-200"
                      }`}
                    >
                      <a
                        href={project.botLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} - Telegram Bot (opens in a new tab)`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Telegram Bot
                      </a>
                    </Button>
                  )}

                  {project.sourceLink && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 gap-1.5 px-4 rounded-full border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white font-sans text-xs font-medium transition-colors"
                    >
                      <a
                        href={project.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} - Source on GitHub (opens in a new tab)`}
                      >
                        <SiGithub className="h-3.5 w-3.5" aria-hidden="true" /> Source
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview
                </h4>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  {project.description}
                </p>
              </div>

              {project.architecture && (
                <div className="space-y-2">
                  <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">
                    Architecture & System Design
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {project.architecture}
                  </p>
                </div>
              )}

              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Deliverables
                  </h4>
                  <ul className="space-y-2.5">
                    {project.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed font-sans"
                      >
                        <span
                          aria-hidden="true"
                          className="text-muted-foreground text-xs mt-1 shrink-0"
                        >
                          ▪
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.roleAndDecisions && (
                <div className="space-y-2 pb-4">
                  <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">
                    Engineering Decisions
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {project.roleAndDecisions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {lightboxIndex !== null && (
        <Suspense fallback={null}>
          <ProjectImageLightbox
            slides={slides}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        </Suspense>
      )}
    </div>,
    document.body,
  );
};

export default ProjectDialog;
