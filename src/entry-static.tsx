import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import Insights from "./pages/Insights";

export const render = (pathname: string) =>
  renderToString(
    <MotionConfig reducedMotion="always">
      <StaticRouter location={pathname} basename={import.meta.env.BASE_URL}>
        {pathname.replace(import.meta.env.BASE_URL, "/").replace(/\/$/, "") === "/insights" ? (
          <Insights />
        ) : (
          <Index />
        )}
      </StaticRouter>
    </MotionConfig>,
  );
