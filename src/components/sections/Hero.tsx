import { scrollToSection } from "@/lib/scroll";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import type { HeroScreen } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const { proofPoints, screens: heroScreens } = portfolio.hero;

const HeroMedia = ({ screen }: { screen: HeroScreen }) => {
  const cls =
    `h-full w-full object-cover ${screen.objectPos ?? "object-center"} ${screen.scale ?? ""}`.trim();
  const isLcp = screen === heroScreens[0];

  const srcSet = [
    screen.srcSm ? `${assetUrl(screen.srcSm)} 960w` : null,
    `${assetUrl(screen.src)} 1400w`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <img
      src={assetUrl(screen.srcSm || screen.src)}
      srcSet={srcSet}
      sizes="(max-width: 640px) 360px, (max-width: 1280px) 50vw, 600px"
      alt={screen.alt}
      width={screen.width}
      height={screen.height}
      className={cls}
      loading={isLcp ? "eager" : "lazy"}
      fetchPriority={isLcp ? "high" : "low"}
      decoding="async"
    />
  );
};

const textReveal = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const wallY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex min-h-[88svh] flex-col overflow-hidden bg-[#050505] px-4 pt-[clamp(3rem,6svh,4.5rem)] text-white sm:px-6 lg:px-8"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: fadeOut }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#09090b_48%,#050505_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_48%,transparent_100%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-[clamp(1.5rem,4svh,2.5rem)] py-[clamp(2rem,5svh,3.5rem)]">
        <div className="grid grid-cols-1 items-start gap-[clamp(2rem,5svh,3rem)] xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:items-center xl:gap-8">
          <motion.div
            className="relative z-20 min-w-0 xl:self-center xl:flex xl:flex-col xl:justify-center"
            style={{ y: reducedMotion ? 0 : typeY }}
          >
            <h1 className="font-marker text-[clamp(3rem,5.5vw,5rem)] leading-[1.38] tracking-[0.01em] text-white -rotate-1 select-none origin-left mb-2 overflow-visible py-2 pr-4 max-md:pr-0 max-md:origin-center max-md:text-center">
              <span className="sr-only">{portfolio.profile.name}</span>
              {portfolio.profile.name.split(/\s+/).map((part, index) => (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className={
                    index === 0
                      ? "block overflow-visible"
                      : "block overflow-visible text-zinc-300 translate-x-1 sm:translate-x-2"
                  }
                  initial={textReveal.initial}
                  animate={textReveal.animate}
                  transition={{ duration: 0.78, delay: index * 0.11, ease: [0.16, 1, 0.3, 1] }}
                >
                  {part.toUpperCase()}
                </motion.span>
              ))}
            </h1>

            <motion.div
              className="mt-[clamp(1.25rem,3svh,1.75rem)] max-w-[60ch] max-md:mx-auto max-md:text-center"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mt-4 max-w-[52ch] text-[clamp(1.1rem,2.2vw,1.45rem)] font-medium leading-relaxed text-zinc-200 max-md:mx-auto">
                {portfolio.profile.tagline}
              </p>
              <p className="mt-3 font-sans text-sm font-medium tracking-wide text-zinc-300">
                {portfolio.profile.role}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative z-10 w-full min-w-0 xl:pl-10"
            style={{ y: reducedMotion ? 0 : wallY }}
            initial={false}
            animate={{ opacity: 1 }}
            aria-label="Selected project interfaces"
          >
            <div className="hidden xl:grid grid-cols-12 gap-4">
              {heroScreens.map((screen, i) => (
                <figure
                  key={screen.title}
                  className={`relative min-h-0 overflow-hidden rounded-2xl bg-[#09090b] transition-all duration-300 col-span-12 xl:col-span-6 aspect-[16/10] ${
                    screen.isDark
                      ? "border border-white/20 ring-1 ring-white/10 hover:border-white/35 hover:ring-white/20"
                      : "ring-1 ring-white/15 hover:ring-white/30"
                  } ${i % 2 === 0 ? "xl:translate-y-6" : "xl:-translate-y-6"}`}
                  style={{
                    boxShadow: screen.isDark
                      ? "0 0 25px -4px rgba(255,255,255,0.08), 0 24px 60px -12px rgba(0,0,0,0.85)"
                      : "0 24px 60px -12px rgba(0,0,0,0.75)",
                  }}
                >
                  <HeroMedia screen={screen} />
                </figure>
              ))}
            </div>

            <div className="xl:hidden relative overflow-hidden motion-reduce:overflow-x-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-[#050505] to-transparent z-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-[#050505] to-transparent z-20" />
              <div className="marquee-track flex w-max">
                {[false, true].map((isDuplicate) => (
                  <div
                    key={isDuplicate ? "clone" : "original"}
                    className={`flex items-center gap-3.5 pr-3.5 ${isDuplicate ? "motion-reduce:hidden" : ""}`}
                    aria-hidden={isDuplicate || undefined}
                  >
                    {heroScreens.map((screen) => (
                      <figure
                        key={screen.title}
                        className={`relative aspect-[16/10] w-[76vw] max-w-[320px] shrink-0 overflow-hidden rounded-2xl bg-[#09090b] transition-all duration-300 ${
                          screen.isDark
                            ? "border border-white/25 ring-1 ring-white/15"
                            : "ring-1 ring-white/15"
                        }`}
                        style={{
                          boxShadow: screen.isDark
                            ? "0 0 22px -2px rgba(255,255,255,0.12), 0 20px 48px -10px rgba(0,0,0,0.85)"
                            : "0 24px 60px -12px rgba(0,0,0,0.75)",
                        }}
                      >
                        <HeroMedia screen={screen} />
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative z-20 mt-[clamp(1rem,3svh,2rem)] grid gap-6 border-t border-white/12 pt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {portfolio.sections.work.enabled && (
              <Button
                variant="ghost"
                className="group h-auto rounded-none border-b border-brand/70 px-0 py-2 text-base text-white hover:bg-transparent hover:text-brand"
                onClick={() => scrollToSection("#work")}
              >
                {portfolio.hero.projectLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            {portfolio.sections.contact.enabled && (
              <Button
                variant="ghost"
                className="group h-auto rounded-none border-b border-white/15 px-0 py-2 text-base text-muted-foreground hover:bg-transparent hover:text-white"
                onClick={() => scrollToSection("#contact")}
              >
                {portfolio.hero.contactLabel}
                <ArrowDownRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Button>
            )}
          </div>

          <dl
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, proofPoints.length)}, minmax(0, 1fr))`,
            }}
            className="grid divide-x divide-white/[0.08] xl:min-w-[520px]"
          >
            {proofPoints.map(([value, label]) => (
              <div key={label} className="min-w-0 px-4 first:pl-0 last:pr-0">
                <dt className="text-2xl font-bold text-white sm:text-3xl font-sans">{value}</dt>
                <dd className="mt-1 font-sans text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
};
