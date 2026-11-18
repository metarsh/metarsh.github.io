import { Link as LinkIcon, Mail, Check } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { portfolio } from "@/config/portfolio";
import React, { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  frame,
  cancelFrame,
  type MotionValue,
} from "framer-motion";
import { SiGithub, SiTelegram, SiHuggingface } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

// Official Kaggle "K" Mark
const KaggleIcon = ({ className = "" }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v9.09l7.913-7.737c.138-.135.303-.203.495-.203h3.139c.164 0 .259.049.281.141.023.092.007.202-.047.332l-6.55 6.275 6.643 7.545c.067.121.08.225.04.316z" />
  </svg>
);

export type DockItemData = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const socialIcons = {
  github: SiGithub,
  linkedin: FaLinkedin,
  telegram: SiTelegram,
  huggingface: SiHuggingface,
  kaggle: KaggleIcon,
  link: LinkIcon,
};
const defaultDockItems: DockItemData[] = [
  {
    id: "email",
    label: "Email (click to copy)",
    href: `mailto:${portfolio.profile.email}`,
    icon: Mail,
  },
  ...portfolio.socials.map((item) => ({ ...item, icon: socialIcons[item.icon] })),
];

interface DockIconProps {
  item: DockItemData;
  register: (id: string, element: HTMLElement | null, distance: MotionValue<number>) => void;
  reducedMotion: boolean;
}

const DockIcon = ({ item, register, reducedMotion }: DockIconProps) => {
  const distance = useMotionValue(Infinity);
  const setRef = useCallback(
    (element: HTMLAnchorElement | HTMLButtonElement | null) => {
      register(item.id, element, distance);
    },
    [item.id, register, distance],
  );
  const { copied, copyText } = useClipboard();
  const sizeSync = useTransform(distance, [-110, 0, 110], [40, 52, 40]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 240, damping: 16 });
  const iconSizeSync = useTransform(distance, [-110, 0, 110], [18, 24, 18]);
  const iconSize = useSpring(iconSizeSync, { mass: 0.1, stiffness: 240, damping: 16 });
  const iconScale = useTransform(iconSize, (value) => value / 18);
  const ySync = useTransform(distance, [-110, 0, 110], [0, -8, 0]);
  const y = useSpring(ySync, { mass: 0.1, stiffness: 240, damping: 16 });

  const Icon = item.icon;

  const handleClick = async (e: React.MouseEvent) => {
    if (item.id === "email") {
      e.preventDefault();
      if (!(await copyText(item.href.replace(/^mailto:/, "")))) {
        window.location.href = item.href;
      }
    }
  };

  if (item.id === "email") {
    return (
      <>
        <motion.button
          ref={setRef}
          type="button"
          onClick={handleClick}
          style={{
            width: reducedMotion ? 40 : size,
            height: reducedMotion ? 40 : size,
            y: reducedMotion ? 0 : y,
          }}
          aria-label={copied ? "Email copied to clipboard!" : "Copy email address"}
          title={copied ? "Copied!" : `Click to copy email (${item.href.replace(/^mailto:/, "")})`}
          className={`group relative flex items-center justify-center rounded-full transition-[color,background-color,translate] duration-150 motion-safe:active:translate-y-0.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white shrink-0 ${
            copied
              ? "bg-emerald-500/20 text-emerald-300"
              : "text-zinc-300 hover:text-white hover:bg-white/[0.09]"
          }`}
        >
          <motion.div
            style={{ width: 18, height: 18, scale: reducedMotion ? 1 : iconScale }}
            className="relative pointer-events-none"
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={copied ? "check" : "mail"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute inset-0"
                aria-hidden="true"
              >
                {copied ? (
                  <Check className="size-full stroke-[2.5]" />
                ) : (
                  <Icon className="size-full" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                aria-hidden="true"
                className="absolute bottom-full mb-2 pointer-events-none px-2.5 py-1 rounded-md bg-zinc-900/95 border border-emerald-400/30 text-xs font-sans font-medium text-emerald-300 shadow-xl z-50 whitespace-nowrap"
              >
                Copied!
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <span role="status" className="sr-only">
          {copied ? "Email copied to clipboard" : ""}
        </span>
      </>
    );
  }

  return (
    <motion.a
      ref={setRef}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: reducedMotion ? 40 : size,
        height: reducedMotion ? 40 : size,
        y: reducedMotion ? 0 : y,
      }}
      aria-label={item.label}
      className="group relative flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.09] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white shrink-0"
    >
      <motion.div
        style={{ width: 18, height: 18, scale: reducedMotion ? 1 : iconScale }}
        className="flex items-center justify-center pointer-events-none"
      >
        <Icon className="w-full h-full transition-colors" aria-hidden="true" />
      </motion.div>
    </motion.a>
  );
};

export const SocialDock = ({
  items = defaultDockItems,
  className = "",
}: {
  items?: DockItemData[];
  className?: string;
}) => {
  const targets = useRef(
    new Map<string, { element: HTMLElement; distance: MotionValue<number> }>(),
  );
  const pointerX = useRef(Infinity);
  const reducedMotion = !!useReducedMotion();
  const register = useCallback(
    (id: string, element: HTMLElement | null, distance: MotionValue<number>) => {
      if (element) targets.current.set(id, { element, distance });
      else targets.current.delete(id);
    },
    [],
  );
  const measure = useCallback(() => {
    const distances = Array.from(targets.current.values()).map(({ element, distance }) => {
      const bounds = element.getBoundingClientRect();
      return { distance, value: pointerX.current - bounds.x - bounds.width / 2 };
    });
    distances.forEach(({ distance, value }) => distance.set(value));
  }, []);
  const reset = useCallback(() => {
    cancelFrame(measure);
    pointerX.current = Infinity;
    targets.current.forEach(({ distance }) => distance.set(Infinity));
  }, [measure]);

  useEffect(() => {
    if (reducedMotion) reset();
    return () => cancelFrame(measure);
  }, [measure, reducedMotion, reset]);

  return (
    <div
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return;
        pointerX.current = event.clientX;
        frame.read(measure);
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`relative inline-flex max-w-full flex-wrap items-center gap-1 py-2 ${className}`}
      role="group"
      aria-label="Social profile quick links"
    >
      {items.map((item) => (
        <DockIcon key={item.id} item={item} register={register} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
};
