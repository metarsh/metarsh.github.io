export const scrollToSection = (anchor: string) => {
  const section = document.getElementById(anchor.replace(/^#/, ""));
  if (!section) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.location.hash !== anchor) window.history.pushState(null, "", anchor);
  if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
  section.focus({ preventScroll: true });
  section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
};
