import type { NormalisedScript } from "../../types/botc";
import { ScriptCharacterList } from "./ScriptCharacterList";
import { ScriptJinxList } from "./ScriptJinxList";

export interface ScriptDisplayProps {
  script: NormalisedScript;
}

export function ScriptDisplay({ script }: ScriptDisplayProps) {
  return (
    <div>
      <h1>
        <span>{script.name || "Custom Script"}</span>
        {script.author && (
          <>
            <span> by </span>
            <span>{script.author}</span>
          </>
        )}
      </h1>
      <h2>Townsfolk</h2>
      <ScriptCharacterList characters={script.teams.townsfolk} />
      <h2>Outsiders</h2>
      <ScriptCharacterList characters={script.teams.outsider} />
      <h2>Minions</h2>
      <ScriptCharacterList characters={script.teams.minion} />
      <h2>Demons</h2>
      <ScriptCharacterList characters={script.teams.demon} />
      {script.jinxes.length > 0 && (
        <>
          <h2>Jinxes</h2>
          <ScriptJinxList jinxes={script.jinxes} />
        </>
      )}
    </div>
  );
}
