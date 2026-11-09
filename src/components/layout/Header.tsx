import { scrollToSection } from "@/lib/scroll";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = portfolio.navigation.filter((item) => portfolio.sections[item.section].enabled);

export const Header = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [visibleSection, setVisibleSection] = useState<string>("#hero");
  const activeSection = location.pathname === "/" ? visibleSection : location.pathname;
  const mobileMenuId = "mobile-navigation";
  const menuRef = useRef<HTMLDivElement>(null);
  useDialogFocus({ ref: menuRef, open: mobileMenuOpen, onClose: () => setMobileMenuOpen(false) });

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sectionIds = Object.entries(portfolio.sections)
      .filter(([, section]) => section.enabled)
      .map(([id]) => id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          );
          setVisibleSection(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0, 0.2, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    if (latest <= 60) {
      setHidden(false);
    } else if (Math.abs(diff) > 8 && !mobileMenuOpen) {
      if (diff > 0 && latest > 120) {
        setHidden(true);
      } else if (diff < 0) {
        setHidden(false);
      }
    }
    setScrolled(latest > 30);
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#") && !href.startsWith("/")) return;
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      requestAnimationFrame(() => scrollToSection(href));
    } else {
      scrollToSection(href);
    }
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1, scale: 1 },
          hidden: { y: "180%", opacity: 0, scale: 0.96 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none px-4 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
      >
        <div
          className={cn(
            "pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 border w-full max-w-2xl mx-auto shadow-2xl",
            scrolled || mobileMenuOpen
              ? "bg-[#09090b]/85 backdrop-blur-xl border-white/10 shadow-black/50"
              : "bg-[#09090b]/40 backdrop-blur-md border-white/5",
          )}
        >
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="col-start-1 justify-self-start flex items-center gap-2 group relative z-50"
            aria-label={`${portfolio.profile.name} home`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/15 group-hover:border-white/40 transition-colors shadow-xs">
              <img
                src={assetUrl(portfolio.profile.avatar)}
                alt=""
                width={32}
                height={32}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </a>

          <nav
            className="col-start-2 justify-self-center hidden md:flex items-center gap-0.5"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const isActive = item.href === activeSection;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={
                    isActive ? (item.href.startsWith("/") ? "page" : "true") : undefined
                  }
                  className={cn(
                    "relative px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-full font-sans",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-zinc-100 hover:bg-white/[0.04]",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white/[0.09] border border-white/15 shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="col-start-3 justify-self-end flex items-center gap-1">
            {portfolio.sections.contact.enabled && (
              <Button
                asChild
                size="sm"
                className={cn(
                  "hidden md:inline-flex h-7 rounded-full px-3.5 text-xs font-medium transition-all font-sans",
                  activeSection === "#contact"
                    ? "bg-white text-zinc-950 ring-2 ring-white/30"
                    : "bg-white text-zinc-950 hover:bg-zinc-200",
                )}
              >
                <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>
                  Let's Talk
                </a>
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="md:hidden relative z-50 p-1.5 text-muted-foreground hover:text-white transition-colors"
            >
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5 w-5">
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }}
                  className="w-full h-px bg-current origin-center transition-transform"
                />
                <motion.div
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  className="w-full h-px bg-current transition-opacity"
                />
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }}
                  className="w-full h-px bg-current origin-center transition-transform"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id={mobileMenuId}
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            tabIndex={-1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-zinc-950 pt-16 pb-28 px-6 md:hidden flex flex-col items-center gap-8"
          >
            <nav
              className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, idx) => {
                const isActive =
                  item.href === activeSection ||
                  (item.href === "#hero" && activeSection === "#hero") ||
                  (item.href === "/insights" && location.pathname === "/insights");

                return (
                  <motion.a
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    aria-current={
                      isActive ? (item.href.startsWith("/") ? "page" : "true") : undefined
                    }
                    className={cn(
                      "text-2xl font-light tracking-widest transition-colors py-2.5 border-b border-white/5 w-full text-center rounded-xl",
                      isActive
                        ? "text-white font-medium bg-white/[0.06] border-white/15 shadow-xs"
                        : "text-muted-foreground hover:text-white",
                    )}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-auto mb-12 flex flex-col items-center gap-4 text-muted-foreground text-sm"
            >
              <p>{portfolio.profile.availability}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
