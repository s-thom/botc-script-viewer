import { use, useMemo, useState } from "react";
import { ScriptDisplay } from "../components/display/ScriptDisplay";
import type { HostedScriptDefinition } from "../types/botc";
import { normaliseScript } from "../util/normalise";
import { usePageView } from "../util/usePageView";

export interface HostedScriptPageProps {
  script: HostedScriptDefinition;
}

export default function HostedScriptPage({ script }: HostedScriptPageProps) {
  usePageView(null);
  const [promise] = useState(() => script.getScript());

  const rawScript = use(promise);
  const normalisedScript = useMemo(
    () => normaliseScript(rawScript),
    [rawScript],
  );

  return <ScriptDisplay script={normalisedScript} />;
}
