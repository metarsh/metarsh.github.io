import { ExternalLink } from "lucide-react";
import { portfolio } from "@/config/portfolio";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { useVisibleActivity } from "@/hooks/useVisibleActivity";

const credentials = portfolio.credentials;

const sortedCredentials = [...credentials].sort((a, b) => b.issuedOn.localeCompare(a.issuedOn));

const resultStyles: Record<string, string> = {
  Winner: "bg-[#b07d2b] text-zinc-950 font-semibold border-transparent",
};

const defaultResultStyle = "bg-white/[0.04] text-zinc-300 border-white/15";

const getResultStyle = (result?: string) =>
  result ? resultStyles[result] || defaultResultStyle : "";

export const Certificates = () => {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isActive = useVisibleActivity(carouselRef);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const prefersReducedMotion = useReducedMotion();

  const displayed = useMemo(() => {
    if (activeFilter === "Hackathons") {
      return sortedCredentials.filter((c) => c.category === "Hackathon");
    }
    if (activeFilter === "Certifications") {
      return sortedCredentials.filter((c) => c.category === "Certification");
    }
    if (activeFilter === "Workshops & Courses") {
      return sortedCredentials.filter((c) => c.category === "Workshop" || c.category === "Course");
    }
    return sortedCredentials;
  }, [activeFilter]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track) return;

    const updateWidth = () => {
      const nextWidth = Math.max(0, track.offsetWidth - carousel.clientWidth);
      setWidth(nextWidth);
      const nextX = Math.max(-nextWidth, Math.min(0, x.get()));
      if (nextX !== x.get()) {
        x.stop();
        setIsDragging(false);
        x.set(nextX);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(carousel);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [displayed, x]);

  useEffect(() => {
    if (prefersReducedMotion || !isActive || isDragging || isHovered || isFocused || width <= 0)
      return;

    let previous: number | null = null;
    let frame: number;
    const advance = (time: number) => {
      const delta = previous === null ? 16 : Math.min(time - previous, 64);
      previous = time;
      const nextX = x.get() - 0.5 * (delta / 16);
      x.set(nextX <= -width ? 0 : nextX);
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, isActive, isDragging, isHovered, isFocused, width, x]);

  const summaryStats = useMemo(() => {
    const categoryCounts = credentials.reduce(
      (acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      },
      { Hackathon: 0, Certification: 0, Workshop: 0, Course: 0 },
    );

    return [
      {
        label: "Hackathons",
        value: categoryCounts.Hackathon || 0,
        detail: "National + campus sprints",
        matte: "#b07d2b", // burnished amber
      },
      {
        label: "Certifications",
        value: categoryCounts.Certification || 0,
        detail: "Vendor verified",
        matte: "#175263", // petrol teal
      },
      {
        label: "Workshops & Courses",
        value: (categoryCounts.Workshop || 0) + (categoryCounts.Course || 0),
        detail: "Deep dives & labs",
        matte: "#8e4a5b", // dusty wine
      },
    ];
  }, []);

  return (
    <section id="credentials" className="py-24 relative bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <SectionHeader title={portfolio.sections.credentials.title} />
            <div className="flex flex-wrap items-center gap-4 mt-5">
              <a
                href={portfolio.credentialsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Verify on LinkedIn
              </a>

              {activeFilter !== "All" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("All");
                    x.stop();
                    setIsDragging(false);
                    x.set(0);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors font-sans px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10"
                >
                  <span>
                    Showing {activeFilter} ({displayed.length})
                  </span>
                  <span className="text-muted-foreground hover:text-white ml-1">✕ Reset</span>
                </button>
              )}
            </div>
          </div>

          <div
            className="grid grid-cols-3 sm:flex sm:flex-nowrap gap-2.5 sm:gap-3 shrink-0"
            role="group"
            aria-label="Filter credentials by category"
          >
            {summaryStats.map((stat) => {
              const isSelected = activeFilter === stat.label;
              return (
                <button
                  key={stat.label}
                  type="button"
                  onClick={() => {
                    setActiveFilter(isSelected ? "All" : stat.label);
                    x.stop();
                    setIsDragging(false);
                    x.set(0);
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${stat.label} (${stat.value} items)`}
                  className={`p-3 sm:p-4 rounded-xl text-left border min-w-0 sm:min-w-[130px] transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white ${
                    isSelected
                      ? "bg-white/[0.08] border-white/40 shadow-lg ring-1 ring-white/20"
                      : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xl sm:text-3xl font-bold text-white font-sans">
                      {stat.value}
                    </p>
                    {isSelected && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: stat.matte }}
                      />
                    )}
                  </div>
                  <p className="text-xs font-sans text-muted-foreground mt-1 leading-snug">
                    {stat.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg focus-within:outline-2 focus-within:outline-white focus-within:outline-offset-2">
        <div
          className="relative w-full cursor-grab active:cursor-grabbing overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          ref={carouselRef}
          role="region"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            x.stop();
            setIsDragging(false);
            x.set(
              Math.max(-width, Math.min(0, x.get() + (event.key === "ArrowLeft" ? 300 : -300))),
            );
          }}
          aria-label="Credentials carousel. Use left and right arrow keys to scroll."
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
          }}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-6 px-2 w-max"
            style={{ x }}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            onDragStart={() => setIsDragging(true)}
            onDragTransitionEnd={() => setIsDragging(false)}
            whileTap={{ cursor: "grabbing" }}
          >
            {displayed.map((credential, index) => {
              const credentialKey = `${credential.title}-${credential.issuedOn}`;
              return (
                <motion.div
                  key={credentialKey}
                  className="relative flex"
                  initial={import.meta.env.SSR ? false : { opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.5 }}
                >
                  <div
                    title={credential.summary}
                    className="w-[350px] min-h-[136px] h-full relative bg-[#0b0b10] border border-white/10 rounded-2xl p-5 flex flex-col hover:border-white/25 hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-sans text-xs font-medium text-zinc-300">
                        {credential.category}
                      </span>
                      {credential.result && (
                        <span
                          className={`shrink-0 font-sans text-xs font-medium px-2 py-0.5 rounded-md border ${getResultStyle(credential.result)}`}
                        >
                          {credential.result}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base sm:text-[17px] font-semibold tracking-tight text-white line-clamp-2 font-sans">
                      {credential.title}
                    </h3>

                    <p className="mt-auto pt-2 text-xs text-muted-foreground font-sans">
                      <span className="break-words">{credential.issuer}</span>
                      <span className="mx-1.5 text-muted-foreground">·</span>
                      <span className="whitespace-nowrap">{credential.issuedLabel}</span>
                      {credential.expiresLabel && (
                        <>
                          <span className="mx-1.5 text-muted-foreground">·</span>
                          <span className="whitespace-nowrap">{credential.expiresLabel}</span>
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
