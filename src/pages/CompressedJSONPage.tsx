import { use, useMemo } from "react";
import { useParams } from "react-router";
import { ScriptDisplay } from "../components/display/ScriptDisplay";
import { decompressFromBase64 } from "../util/compression";
import { normaliseScript } from "../util/normalise";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CACHE = new Map<string, Promise<any>>();

async function rawDecodeScript(base64: string) {
  const str = await decompressFromBase64(base64);

  return JSON.parse(str);
}

function decodeScript(base64: string) {
  if (CACHE.has(base64)) {
    return CACHE.get(base64)!;
  }

  const promise = rawDecodeScript(base64);
  CACHE.set(base64, promise);
  return promise;
}

export default function CompressedJSONPage() {
  const { json: compressedBase64 } = useParams();

  const promise = useMemo(() => {
    if (!compressedBase64) {
      throw new Error("No JSON found");
    }
    return decodeScript(compressedBase64);
  }, [compressedBase64]);

  const rawScript = use(promise);
  const normalisedScript = useMemo(
    () => normaliseScript(rawScript),
    [rawScript],
  );

  return <ScriptDisplay script={normalisedScript} />;
}
