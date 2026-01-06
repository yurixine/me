import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle SPA redirect from 404.html (GitHub Pages)
const redirectPath = sessionStorage.getItem("spa-redirect");
if (redirectPath) {
  sessionStorage.removeItem("spa-redirect");
  // Replace the current URL with the stored path
  window.history.replaceState(null, "", redirectPath);
}

createRoot(document.getElementById("root")!).render(<App />);
