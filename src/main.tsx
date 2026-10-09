import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"
import { FilterOptionsProvider } from "./context/filterOptionsCOntext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <FilterOptionsProvider>

      <App />
      </FilterOptionsProvider>

    </BrowserRouter>
  </StrictMode>
);