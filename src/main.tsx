import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./App";

// A tab that was open during a new release can ask for a chunk that no longer exists. Reload once to get the new files.
window.addEventListener("vite:preloadError", () => {
  try {
    if (sessionStorage.getItem("wr:reloaded")) return;
    sessionStorage.setItem("wr:reloaded", "1");
  } catch {
    return;
  }
  window.location.reload();
});
window.addEventListener("load", () => window.setTimeout(() => sessionStorage.removeItem("wr:reloaded"), 5000));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
