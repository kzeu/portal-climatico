import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/baloo-2/latin-400.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-ext-400.css";
import "@fontsource/baloo-2/latin-ext-700.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
