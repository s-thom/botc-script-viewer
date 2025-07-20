import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ScriptPageWrapper } from "../components/misc/ScriptPageWrapper";
import { BASE_3 } from "../scripts/base3";
import { CAROUSEL_COLLECTION } from "../scripts/carousel-collection";
import { RANDOM_SCRIPTS } from "../scripts/random";
import { WORLD_CUP_25 } from "../scripts/wc25";

const BotCScriptsPage = lazy(() => import("../pages/BotCScriptsPage"));
const CompressedJSONPage = lazy(() => import("../pages/CompressedJSONPage"));
const UncompressedJSONPage = lazy(
  () => import("../pages/UncompressedJSONPage"),
);
const HostedScriptPage = lazy(() => import("../pages/HostedScriptPage"));
const HomePage = lazy(() => import("../pages/Home"));
const UrlScriptPage = lazy(() => import("../pages/UrlScriptPage"));

const HOSTED_SCRIPTS = {
  b3: BASE_3,
  cc: CAROUSEL_COLLECTION,
  wc25: WORLD_CUP_25,
  r: RANDOM_SCRIPTS,
};

const DYNAMIC_ROUTES = {
  "s/:id": BotCScriptsPage,
  "u/:url": UrlScriptPage,
  "gz/:json": CompressedJSONPage,
  "uncompressed/:json": UncompressedJSONPage,
};

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/error" element={<ErrorPage />} />
        <Route path="/appload" element={<AppLoadingPage />} />
        <Route path="/scriptload" element={<ScriptLoadingPage />} /> */}
        {Object.entries(HOSTED_SCRIPTS).map(([path, scripts]) => (
          <Route key={path} path={path}>
            {scripts.map((script) => (
              <Route
                key={script.id}
                path={script.id}
                element={
                  <ScriptPageWrapper>
                    <HostedScriptPage script={script} />
                  </ScriptPageWrapper>
                }
              />
            ))}
          </Route>
        ))}
        {Object.entries(DYNAMIC_ROUTES).map(([path, Component]) => (
          <Route
            key={path}
            path={path}
            element={
              <ScriptPageWrapper>
                <Component />
              </ScriptPageWrapper>
            }
          />
        ))}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
