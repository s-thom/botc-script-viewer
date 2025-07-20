import { use, useMemo } from "react";
import { ScriptDisplay } from "../components/display/ScriptDisplay";
import { RawScriptContextProvider } from "../components/misc/RawScriptContext";
import { normaliseScript } from "../util/normalise";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CACHE = new Map<string, Promise<any>>();

async function rawFetchScript(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to find script");
  }

  return response.json();
}

function fetchScript(url: string) {
  if (CACHE.has(url)) {
    return CACHE.get(url)!;
  }

  const promise = rawFetchScript(url);
  CACHE.set(url, promise);
  return promise;
}

export interface RemoteScriptLoaderProps {
  url: string;
}

export function RemoteScriptLoader({ url }: RemoteScriptLoaderProps) {
  const promise = useMemo(() => fetchScript(url), [url]);

  const rawScript = use(promise);
  const normalisedScript = useMemo(
    () => normaliseScript(rawScript),
    [rawScript],
  );

  return (
    <RawScriptContextProvider value={rawScript}>
      <ScriptDisplay script={normalisedScript} />
    </RawScriptContextProvider>
  );
}
