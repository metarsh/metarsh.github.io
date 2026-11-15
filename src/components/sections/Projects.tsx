import { Bot, Code2 } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import type { Project } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const projects = portfolio.projects;
const projectIcons = { Bot, Code2 };
import { imageMetadata } from "virtual:portfolio-images";
const ProjectDialog = lazy(() => import("@/components/ProjectDialog"));

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
      initial={import.meta.env.SSR ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(project)}
      aria-label={`Open case study for ${project.title}`}
      className="group text-left relative min-h-[250px] sm:min-h-[270px] w-full cursor-pointer overflow-hidden rounded-[24px] p-4 sm:p-5 pb-0 sm:pb-0 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.55)] select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
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
                    project.imageSm
                      ? `${assetUrl(project.imageSm)} ${imageMetadata[project.imageSm].width}w`
                      : null,
                    `${assetUrl(cover)} ${imageMetadata[cover].width}w`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 380px"
                  alt={`${project.title} preview`}
                  loading="lazy"
                  decoding="async"
                  width={imageMetadata[cover].width}
                  height={imageMetadata[cover].height}
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

      <Suspense fallback={null}>
        <AnimatePresence>
          {selected && (
            <ProjectDialog key={selected.title} project={selected} onClose={closeProject} />
          )}
        </AnimatePresence>
      </Suspense>
    </section>
  );
};
