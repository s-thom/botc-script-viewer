import { useCallback, useMemo } from "react";
import styles from "../../css/display.module.css";
import type { ScriptMetadata } from "../../generated/script-schema";
import { useRawScript } from "./RawScriptContext";

export function ScriptDownloadLink() {
  const rawScript = useRawScript();

  const scriptFileName = useMemo(() => {
    const meta = rawScript.find(
      (item): item is ScriptMetadata =>
        typeof item === "object" && item.id === "_meta",
    );
    // Sometimes people put the script name as empty string, so also check for that
    if (!meta || meta.name === "") {
      return "script";
    }

    return meta.name.replace(/[\\/:*?"<>|]+/g, "_");
  }, [rawScript]);

  const downloadScript = useCallback(() => {
    const blob = new Blob([JSON.stringify(rawScript)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", `${scriptFileName}.json`);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  }, [rawScript, scriptFileName]);

  return (
    <button
      type="button"
      onClick={downloadScript}
      className={styles.LinkButton}
    >
      Download JSON
    </button>
  );
}
