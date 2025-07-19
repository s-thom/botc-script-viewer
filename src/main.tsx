import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import { AppLoadingPage } from "./pages/AppLoadingPage.tsx";
import { BotCScriptsPage } from "./pages/BotCScriptsPage.tsx";
import { CompressedJSONPage } from "./pages/CompressedJSONPage.tsx";
import { HomePage } from "./pages/Home.tsx";
import { HostedScriptPage } from "./pages/HostedScriptPage.tsx";
import { ScriptLoadingPage } from "./pages/ScriptLoadingPage.tsx";
import { UncompressedJSONPage } from "./pages/UncompressedJSONPage.tsx";
import { UrlScriptPage } from "./pages/UrlScriptPage.tsx";
import { BASE_3 } from "./scripts/base3/index.ts";
import { CAROUSEL_COLLECTION } from "./scripts/carousel-collection/index.ts";
import { WORLD_CUP_25 } from "./scripts/wc25/index.ts";

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
          <Route path="wc25">
            {WORLD_CUP_25.map((script) => (
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
          <Route
            path="s/:id"
            element={
              <Suspense fallback={<ScriptLoadingPage />}>
                <BotCScriptsPage />
              </Suspense>
            }
          />
          <Route
            path="u/:url"
            element={
              <Suspense fallback={<ScriptLoadingPage />}>
                <UrlScriptPage />
              </Suspense>
            }
          />
          <Route
            path="gz/:json"
            element={
              <Suspense fallback={<ScriptLoadingPage />}>
                <CompressedJSONPage />
              </Suspense>
            }
          />
          <Route
            path="uncompressed/:json"
            element={
              <Suspense fallback={<ScriptLoadingPage />}>
                <UncompressedJSONPage />
              </Suspense>
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
