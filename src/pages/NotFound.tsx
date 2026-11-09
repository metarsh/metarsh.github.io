import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const NotFound = () => {
  const reduce = useReducedMotion();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white px-4">
      <div className="text-center max-w-md">
        <motion.img
          src={assetUrl(portfolio.research.image)}
          alt="Lost companion mascot"
          width={112}
          height={112}
          loading="eager"
          decoding="async"
          animate={reduce ? undefined : { y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
          transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 h-28 w-28 rounded-full object-cover shadow-2xl ring-1 ring-white/15 grayscale hover:grayscale-0 transition-all duration-500"
        />
        <h1 className="mb-2 text-5xl font-serif font-bold text-white tracking-tight">404</h1>
        <p className="mb-6 text-muted-foreground font-sans text-sm">
          The coordinates you followed don't exist in this sector.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-white text-zinc-950 font-sans text-xs font-medium hover:bg-zinc-200 transition-colors"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
