import { Bot, MessageCircle, Code2, Globe, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import type { Project } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useState, useMemo, useRef } from "react";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import type { LightboxSlide } from "@/components/ProjectImageLightbox";
import { SectionHeader } from "@/components/SectionHeader";
import { TechLogo } from "@/components/TechLogo";

const projects = portfolio.projects;
const projectIcons = { Bot, Code2 };
const ProjectImageLightbox = lazy(() =>
  import("@/components/ProjectImageLightbox").then((module) => ({
    default: module.ProjectImageLightbox,
  })),
);

const coverOf = (p: Project): string | null => p.gallery?.[0] ?? p.image ?? null;

const ProjectCard = ({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) => {
  const isLight = project.lightText === false;
  const Icon = projectIcons[project.icon ?? "Code2"];
  const cover = coverOf(project);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(project)}
      aria-label={`Open case study for ${project.title}`}
      className="group text-left relative h-[250px] sm:h-[270px] w-full cursor-pointer overflow-hidden rounded-[24px] p-4 sm:p-5 pb-0 sm:pb-0 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.55)] select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
      style={{ backgroundColor: project.matte ?? "#0b0b10" }}
    >
      <div className="relative z-10 w-full transition-all duration-300 pointer-events-none">
        <h3
          className={`font-sans font-bold text-base sm:text-lg tracking-tight leading-tight ${
            isLight ? "text-zinc-950" : "text-white"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`font-sans text-xs sm:text-sm mt-0.5 leading-snug line-clamp-1 ${
            isLight ? "text-zinc-700 font-medium" : "text-zinc-300"
          }`}
        >
          {project.tagline}
        </p>
      </div>

      <div className="relative w-full mt-auto flex justify-center items-end pointer-events-none">
        <div className="w-[88%] sm:w-[90%] translate-y-3 sm:translate-y-3.5 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="overflow-hidden rounded-t-xl sm:rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)] border-t border-x border-white/10 bg-[#0a0a0e]">
            <div className="h-[158px] sm:h-[174px] w-full overflow-hidden bg-[#0a0a0e] flex items-start justify-center">
              {cover ? (
                <img
                  src={assetUrl(project.imageSm || cover)}
                  srcSet={[
                    project.imageSm ? `${assetUrl(project.imageSm)} 750w` : null,
                    `${assetUrl(cover)} 1400w`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 380px"
                  alt={`${project.title} preview`}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover object-top block"
                />
              ) : (
                <div className="flex flex-col gap-3 items-center justify-center h-full w-full">
                  <Icon className="h-10 w-10 text-white/30" />
                  <span className="text-sm text-zinc-300">{project.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

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
      list.push({ src: assetUrl(src), alt: project.title });
    };

    if (project.gallery) {
      project.gallery.forEach(add);
    }
    add(project.image);

    return list;
  }, [project]);
  const hasMedia = slides.length > 0;

  return (
    <>
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

          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {hasMedia && (
              <div className="w-full lg:w-[48%] xl:w-[50%] bg-[#08080c] border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5">
                {slides.map((slide, index) => (
                  <div
                    key={slide.src}
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxIndex(index);
                      }
                    }}
                    aria-label={`${project.title} preview`}
                    className="rounded-xl overflow-hidden border border-white/10 hover:border-white/25 bg-[#121218] shadow-xl cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
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
                      width={1200}
                      height={750}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className={`w-full ${hasMedia ? "lg:w-[52%] xl:w-[50%]" : ""} bg-[#0c0c12] overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-6 font-sans`}
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

              {(project.link || project.botLink) && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {project.link && (
                    <Button
                      asChild
                      size="sm"
                      className="h-8 px-4 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-sans text-xs font-medium transition-colors border-0"
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-1.5 h-3.5 w-3.5" /> Live site
                      </a>
                    </Button>
                  )}

                  {project.botLink && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 px-4 rounded-full border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white font-sans text-xs transition-colors"
                    >
                      <a href={project.botLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Telegram Bot
                      </a>
                    </Button>
                  )}

                  {project.link?.includes("github.com") && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 px-4 rounded-full border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white font-sans text-xs transition-colors"
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <SiGithub className="mr-1.5 h-3.5 w-3.5" /> Source
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
                        <span aria-hidden="true" className="text-muted-foreground text-xs mt-1 shrink-0">
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
    </>
  );
};

export const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const closeProject = useCallback(() => setSelected(null), []);

  return (
    <section
      id="work"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#050505]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-white/5 to-transparent opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          align="center"
          className="mb-12 sm:mb-16"
          title={portfolio.sections.work.title}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectDialog key={selected.title} project={selected} onClose={closeProject} />
        )}
      </AnimatePresence>
    </section>
  );
};
