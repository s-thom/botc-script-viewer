import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppLoadingPage } from "./pages/AppLoadingPage.tsx";
import { AppRouter } from "./router/AppRouter.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<AppLoadingPage />}>
      <AppRouter />
    </Suspense>
  </StrictMode>,
);
