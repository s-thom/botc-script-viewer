import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { AppLoadingPage } from "./pages/AppLoadingPage.tsx";
import { HomePage } from "./pages/Home.tsx";
import { HostedScriptPage } from "./pages/HostedScriptPage.tsx";
import { ScriptLoadingPage } from "./pages/ScriptLoadingPage.tsx";
import { BASE_3 } from "./scripts/base3/index.ts";
import { CAROUSEL_COLLECTION } from "./scripts/carousel-collection/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<AppLoadingPage />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="b3">
            {BASE_3.map((script) => (
              <Route
                key={script.id}
                path={script.id}
                element={
                  <Suspense fallback={<ScriptLoadingPage />}>
                    <HostedScriptPage script={script} />
                  </Suspense>
                }
              />
            ))}
          </Route>
          <Route path="cc">
            {CAROUSEL_COLLECTION.map((script) => (
              <Route
                key={script.id}
                path={script.id}
                element={
                  <Suspense fallback={<ScriptLoadingPage />}>
                    <HostedScriptPage script={script} />
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
