import { ArrowRight } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/ui/card";

type CuteParticle = {
  id: number;
  symbol: string;
  x: number;
  y: number;
  drift: number;
  rotation: number;
  color: string;
  size: number;
};

const SYMBOLS = ["🐾", "⭐", "♡", "🌸", "🫧", "₊˚", "⋆"];
const COLORS = ["#f472b6", "#a78bfa", "#38bdf8", "#34d399", "#fbbf24", "#fb7185"];

const CompanionCard = () => {
  const [particles, setParticles] = useState<CuteParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) clearTimeout(timer);
    };
  }, []);

  const spawnParticle = useCallback(
    (originX?: number, originY?: number) => {
      if (prefersReduced) return;
      const id = nextId.current++;
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const x = originX ?? 25 + Math.random() * 50;
      const y = originY ?? 65 + Math.random() * 20;
      const drift = (Math.random() - 0.5) * 50;
      const rotation = (Math.random() - 0.5) * 50;
      const size = 13 + Math.random() * 7;

      setParticles((prev) => [
        ...prev.slice(-16),
        { id, symbol, x, y, drift, rotation, color, size },
      ]);
    },
    [prefersReduced],
  );

  useEffect(() => {
    if (!isHovered || prefersReduced) return;
    spawnParticle();
    const interval = setInterval(() => {
      spawnParticle();
    }, 380);
    return () => clearInterval(interval);
  }, [isHovered, prefersReduced, spawnParticle]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    for (let i = 0; i < 6; i++) {
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        spawnParticle(clickX + (Math.random() - 0.5) * 16, clickY + (Math.random() - 0.5) * 16);
      }, i * 50);
      timers.current.add(timer);
    }
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="group lg:sticky lg:top-28 p-3.5 bg-[#0b0b10] border border-white/10 rounded-2xl relative overflow-visible hover:border-white/25 transition-all duration-300 cursor-pointer select-none"
    >
      <div
        className="absolute inset-0 pointer-events-none overflow-visible z-30"
        aria-hidden="true"
      >
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 0, scale: 0.3, y: 0, x: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.3, 1.15, 0.9],
                y: -100,
                x: p.drift,
                rotate: p.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                setParticles((prev) => prev.filter((item) => item.id !== p.id));
              }}
              className="absolute pointer-events-none drop-shadow-sm font-sans"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                color: p.color,
                fontSize: `${p.size}px`,
              }}
            >
              {p.symbol}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <img
          src={assetUrl(portfolio.research.image)}
          alt={portfolio.research.imageAlt}
          width={748}
          height={748}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute bottom-3 left-3 flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-950/85 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-mono tracking-wide font-medium shadow-lg">
            {portfolio.research.badge}
          </span>
        </div>
      </div>
    </Card>
  );
};

const publications = portfolio.publications;

export const Publications = () => {
  return (
    <section id="research" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader align="center" className="mb-14" title={portfolio.sections.research.title} />
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <CompanionCard />
          </motion.div>

          <div className="flex flex-col gap-5">
            {publications.map((pub, i) => (
              <motion.article
                key={pub.title}
                className="rounded-2xl border border-white/10 bg-[#0b0b10] p-6 sm:p-7 transition-colors duration-200 hover:border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center rounded-md px-2.5 py-1 font-sans text-xs font-semibold text-white tracking-wide shadow-xs"
                    style={{ backgroundColor: pub.matte }}
                  >
                    {pub.venue}
                  </span>
                </div>

                <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-white font-sans">
                  {pub.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-300 font-sans">
                  {pub.result}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
                  {pub.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${pub.title} - ${l.label} (opens in a new tab)`}
                      className="group inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-sans text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span>{l.label}</span>
                      <ArrowRight
                        className="h-3 w-3 text-zinc-400 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
