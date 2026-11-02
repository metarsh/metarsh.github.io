import { Link as LinkIcon, Mail, Check } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { portfolio } from "@/config/portfolio";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
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
  mouseX: ReturnType<typeof useMotionValue<number>>;
}

const DockIcon = ({ item, mouseX }: DockIconProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (element: HTMLAnchorElement | HTMLButtonElement | null) => {
    ref.current = element;
  };
  const { copied, copyText } = useClipboard();
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - bounds.x - bounds.width / 2;
  });
  const sizeSync = useTransform(distance, [-110, 0, 110], [40, 52, 40]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 240, damping: 16 });
  const iconSizeSync = useTransform(distance, [-110, 0, 110], [18, 24, 18]);
  const iconSize = useSpring(iconSizeSync, { mass: 0.1, stiffness: 240, damping: 16 });
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
      <motion.button
        ref={setRef}
        type="button"
        onClick={handleClick}
        style={{ width: size, height: size, y }}
        aria-label={copied ? "Email copied to clipboard!" : "Copy email address"}
        title={copied ? "Copied!" : `Click to copy email (${item.href.replace(/^mailto:/, "")})`}
        className={`group relative flex items-center justify-center rounded-full border transition-colors shadow-lg cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white shrink-0 ${
          copied
            ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-emerald-900/30"
            : "bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.09] hover:border-white/25"
        }`}
      >
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center pointer-events-none"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
              >
                <Check className="w-full h-full text-emerald-300 stroke-[2.5]" />
              </motion.div>
            ) : (
              <motion.div
                key="mail"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Icon className="w-full h-full transition-colors" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -2, scale: 0.85 }}
              animate={{ opacity: 1, y: -38, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="absolute pointer-events-none px-2.5 py-1 rounded-md bg-zinc-900/95 border border-emerald-400/30 text-[11px] font-sans font-medium text-emerald-300 shadow-xl flex items-center gap-1 z-50 whitespace-nowrap backdrop-blur-md"
            >
              <Check className="w-3 h-3 text-emerald-300 stroke-[2.5]" />
              <span>Copied!</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <motion.a
      ref={setRef}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ width: size, height: size, y }}
      aria-label={item.label}
      className="group relative flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.09] hover:border-white/25 transition-colors shadow-lg cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white shrink-0"
    >
      <motion.div
        style={{ width: iconSize, height: iconSize }}
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
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`relative inline-flex items-center h-[74px] gap-2 sm:gap-2.5 px-3 sm:px-3.5 rounded-full bg-white/[0.025] border border-white/10 backdrop-blur-xs shadow-xl ${className}`}
      role="group"
      aria-label="Social profile quick links"
    >
      {items.map((item) => (
        <DockIcon key={item.id} item={item} mouseX={mouseX} />
      ))}
    </div>
  );
};
