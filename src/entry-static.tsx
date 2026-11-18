import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";

export const renderNotFound = () => renderToString(<NotFound />);

export const render = (pathname: string) =>
  renderToString(
    <StaticRouter location={pathname} basename={import.meta.env.BASE_URL}>
      <App InsightsPage={Insights} />
    </StaticRouter>,
  );
