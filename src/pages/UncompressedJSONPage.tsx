import { useMemo } from "react";
import { useParams } from "react-router";
import { ScriptDisplay } from "../components/display/ScriptDisplay";
import { RawScriptContextProvider } from "../components/misc/RawScriptContext";
import { decodeUrlSafeBase64 } from "../util/compression";
import { normaliseScript } from "../util/normalise";
import { usePageView } from "../util/usePageView";

export default function UncompressedJSONPage() {
  usePageView("/uncompressed/<path>");
  const { json: uncompressedBase64 } = useParams();

  const rawScript = useMemo(() => {
    if (!uncompressedBase64) {
      throw new Error("No JSON found");
    }

    const str = decodeUrlSafeBase64(uncompressedBase64);
    return JSON.parse(str);
  }, [uncompressedBase64]);

  const normalisedScript = useMemo(() => {
    return normaliseScript(rawScript);
  }, [rawScript]);

  return (
    <RawScriptContextProvider value={rawScript}>
      <ScriptDisplay script={normalisedScript} />
    </RawScriptContextProvider>
  );
}
