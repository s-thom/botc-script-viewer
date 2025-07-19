import { useParams } from "react-router";
import { RemoteScriptLoader } from "./RemoteScriptLoader";

export default function UrlScriptPage() {
  const { url: rawUrl } = useParams();
  if (!rawUrl) {
    throw new Error("No ID in route");
  }

  const url = decodeURIComponent(rawUrl);

  return <RemoteScriptLoader url={url} />;
}
