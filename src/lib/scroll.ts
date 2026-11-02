export const scrollToSection = (anchor: string) => {
  const section = document.getElementById(anchor.replace(/^#/, ""));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
};
