import { portfolio } from "@/config/portfolio";
import { Suspense, lazy, useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { pageMetadata } from "@/lib/metadata";
import { scrollToSection } from "@/lib/scroll";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
const FloatingCat = lazy(() =>
  import("@/components/layout/FloatingCat").then((module) => ({ default: module.FloatingCat })),
);
const Insights = lazy(() => import("./pages/Insights"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RouteLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-[#050505]"
    role="status"
    aria-live="polite"
  >
    <div
      className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"
      aria-hidden="true"
    />
    <span className="sr-only">Loading page...</span>
  </div>
);

const EligiblePet = () => {
  const [eligible, setEligible] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 48rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEligible(media.matches && document.visibilityState === "visible");
    const timer = setTimeout(update, 800);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(timer);
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return eligible ? (
    <Suspense fallback={null}>
      <FloatingCat />
    </Suspense>
  ) : null;
};

const RouteEffects = () => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    const metadata = pageMetadata({ ...portfolio, site: __PORTFOLIO_SITE__ }, location.pathname);
    document.title = metadata.title;
    for (const [selector, content] of [
      ['meta[name="description"]', metadata.description],
      ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description],
      ['meta[property="og:url"]', metadata.canonical],
      ['meta[property="og:type"]', metadata.type],
      ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="twitter:description"]', metadata.description],
    ])
      document.querySelector(selector)?.setAttribute("content", content);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical);
    if (location.hash && !location.hash.startsWith("#/")) {
      requestAnimationFrame(() => scrollToSection(location.hash));
    } else if (previousPath.current !== location.pathname) window.scrollTo(0, 0);
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash]);
  return null;
};

const App = () => (
  <MotionConfig reducedMotion="user">
    {portfolio.pet.enabled && <EligiblePet />}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Index />} />
        {portfolio.sections.insights.enabled && (
          <Route
            path="/insights"
            element={
              <Suspense fallback={<RouteLoader />}>
                <Insights />
              </Suspense>
            }
          />
        )}
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </MotionConfig>
);
export default App;
