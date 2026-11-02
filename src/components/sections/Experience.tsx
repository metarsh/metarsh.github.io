import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { TechLogo } from "@/components/TechLogo";
import { RichText } from "@/components/RichText";

const experiences = portfolio.experiences;

export const Experience = () => {
  const experienceItems = experiences.map((experience, index) => (
    <motion.article
      key={experience.role}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-6 sm:pl-8 pb-12 last:pb-0 border-l border-white/10 group"
    >
      <span
        className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#050505] transition-transform duration-300 group-hover:scale-125"
        style={{ backgroundColor: experience.matte }}
      />

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
        <h3 className="text-xl font-bold tracking-tight text-white font-sans">{experience.role}</h3>
        <span className="font-mono text-xs text-zinc-400 shrink-0">{experience.timeframe}</span>
      </div>

      <p className="mt-1 font-sans text-sm font-medium text-zinc-300">{experience.company}</p>

      <div className="mt-4 space-y-2">
        {experience.bullets.map((bullet, i) => (
          <p key={i} className="text-[15px] leading-7 text-zinc-300 sm:text-base font-sans">
            {typeof bullet === "string" ? bullet : <RichText parts={bullet} />}
          </p>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 pt-2 pb-2">
        {experience.stack.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full hover:text-white transition-colors"
          >
            <TechLogo name={item} className="w-3.5 h-3.5 shrink-0" />
            <span>{item}</span>
          </span>
        ))}
      </div>
    </motion.article>
  ));

  return (
    <section
      id="experience"
      className="relative z-10 bg-[#050505] py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl relative z-10">
        <SectionHeader
          align="center"
          className="mb-16"
          title={portfolio.sections.experience.title}
        />
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(260px,360px)_1fr] items-start">
          <div className="order-1 lg:order-none w-full max-w-[280px] sm:max-w-[340px] lg:max-w-none mx-auto aspect-[9/16] lg:aspect-auto lg:h-[520px] xl:h-[560px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl lg:sticky lg:top-24 bg-[#09090b]">
            <img
              src={assetUrl(portfolio.experience.image)}
              alt={portfolio.experience.imageAlt}
              width={576}
              height={1024}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          <div className="order-2 pt-2">{experienceItems}</div>
        </div>
      </div>
    </section>
  );
};
