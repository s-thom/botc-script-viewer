import { useParams } from "react-router";
import { usePageView } from "../util/usePageView";
import { RemoteScriptLoader } from "./RemoteScriptLoader";

export default function UrlScriptPage() {
  usePageView("/u/<path>");
  const { url: rawUrl } = useParams();
  if (!rawUrl) {
    throw new Error("No ID in route");
  }

  const url = decodeURIComponent(rawUrl);

  return <RemoteScriptLoader url={url} />;
}
