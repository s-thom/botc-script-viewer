import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ScriptPageWrapper } from "../components/misc/ScriptPageWrapper";
import { BotCScriptsPage } from "../pages/BotCScriptsPage";
import { CompressedJSONPage } from "../pages/CompressedJSONPage";
import { HomePage } from "../pages/Home";
import { HostedScriptPage } from "../pages/HostedScriptPage";
import { UncompressedJSONPage } from "../pages/UncompressedJSONPage";
import { UrlScriptPage } from "../pages/UrlScriptPage";
import { BASE_3 } from "../scripts/base3";
import { CAROUSEL_COLLECTION } from "../scripts/carousel-collection";
import { WORLD_CUP_25 } from "../scripts/wc25";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/error" element={<ErrorPage />} />
        <Route path="/appload" element={<AppLoadingPage />} />
        <Route path="/scriptload" element={<ScriptLoadingPage />} /> */}
        <Route path="b3">
          {BASE_3.map((script) => (
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
        <Route path="cc">
          {CAROUSEL_COLLECTION.map((script) => (
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
        <Route path="wc25">
          {WORLD_CUP_25.map((script) => (
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
        <Route
          path="s/:id"
          element={
            <ScriptPageWrapper>
              <BotCScriptsPage />
            </ScriptPageWrapper>
          }
        />
        <Route
          path="u/:url"
          element={
            <ScriptPageWrapper>
              <UrlScriptPage />
            </ScriptPageWrapper>
          }
        />
        <Route
          path="gz/:json"
          element={
            <ScriptPageWrapper>
              <CompressedJSONPage />
            </ScriptPageWrapper>
          }
        />
        <Route
          path="uncompressed/:json"
          element={
            <ScriptPageWrapper>
              <UncompressedJSONPage />
            </ScriptPageWrapper>
          }
        />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
