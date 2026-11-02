import { portfolio } from "@/config/portfolio";
import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { FloatingCat } from "@/components/layout/FloatingCat";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
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

const App = () => (
  <MotionConfig reducedMotion="user">
    {portfolio.pet.enabled && <FloatingCat />}
    <HashRouter>
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
    </HashRouter>
  </MotionConfig>
);

export default App;
