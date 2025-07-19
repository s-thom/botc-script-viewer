import { useParams } from "react-router";
import { RemoteScriptLoader } from "./RemoteScriptLoader";

export default function BotCScriptsPage() {
  const { id } = useParams();
  if (!id) {
    throw new Error("No ID in route");
  }

  const url = `https://botc-scripts.azurewebsites.net/api/scripts/${id}/json/`;

  return <RemoteScriptLoader url={url} />;
}
