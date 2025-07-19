import { useMemo } from "react";
import { useParams } from "react-router";
import { ScriptDisplay } from "../components/display/ScriptDisplay";
import { decodeUrlSafeBase64 } from "../util/compression";
import { normaliseScript } from "../util/normalise";

export function UncompressedJSONPage() {
  const { json: uncompressedBase64 } = useParams();

  const normalisedScript = useMemo(() => {
    if (!uncompressedBase64) {
      throw new Error("No JSON found");
    }

    const str = decodeUrlSafeBase64(uncompressedBase64);
    const rawScript = JSON.parse(str);
    return normaliseScript(rawScript);
  }, [uncompressedBase64]);

  return <ScriptDisplay script={normalisedScript} />;
}
