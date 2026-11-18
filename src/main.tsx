import { createRoot, hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./index.css";

const legacyRoute = window.location.hash.startsWith("#/");
if (legacyRoute) {
  const route = window.location.hash.slice(2);
  window.history.replaceState(null, "", `${import.meta.env.BASE_URL}${route}`);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
if (rootElement.hasChildNodes() && !legacyRoute) hydrateRoot(rootElement, app);
else createRoot(rootElement).render(app);
