import { createRoot, hydrateRoot } from "react-dom/client";
import NotFound from "./pages/NotFound";
import "@fontsource/instrument-serif/latin-400.css";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

if (root.hasChildNodes()) hydrateRoot(root, <NotFound />);
else createRoot(root).render(<NotFound />);
