import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) => {
  const reduce = useReducedMotion();
  const centered = align === "center";

  const reveal = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
  };

  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      <motion.h2
        className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.18] sm:leading-[1.14] tracking-[-0.015em] gradient-heading pb-1 overflow-visible"
        {...reveal}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={cn(
            "mt-5 text-lg leading-relaxed text-muted-foreground",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
          {...reveal}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
