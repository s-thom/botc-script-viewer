import { Route } from "react-router";
import { HostedScriptPage } from "../pages/HostedScriptPage";
import type { HostedScriptDefinition } from "../types/botc";

export interface HostedRoutesProps {
  path: string;
  scripts: HostedScriptDefinition[];
}

export function HostedRoutes({ path, scripts }: HostedRoutesProps) {
  return (
    <Route path={path}>
      {scripts.map((script) => (
        <Route
          key={script.id}
          path={script.id}
          element={<HostedScriptPage script={script} />}
        />
      ))}
    </Route>
  );
}
