import { use, useMemo, useState } from "react";
import { ScriptDisplay } from "../components/display/ScriptDisplay";
import type { HostedScriptDefinition } from "../types/botc";
import { normaliseScript } from "../util/normalise";

export interface HostedScriptPageProps {
  script: HostedScriptDefinition;
}

export default function HostedScriptPage({ script }: HostedScriptPageProps) {
  const [promise] = useState(() => script.getScript());

  const rawScript = use(promise);
  const normalisedScript = useMemo(
    () => normaliseScript(rawScript),
    [rawScript],
  );

  return <ScriptDisplay script={normalisedScript} />;
}
