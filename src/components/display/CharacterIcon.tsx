import { clsx } from "clsx";
import { memo, useRef } from "react";
import * as CHARACTER_ICONS from "../../generated/character-icons";
import type { ScriptCharacter } from "../../generated/script-schema";
import { CHARACTERS_BY_ID } from "../../util/characters";

const ALLOWED_EXTERNAL_HOSTNAMES = ["release.botc.app", "i.imgur.com"];

function getFallbackIconUrl(team: ScriptCharacter["team"]): string {
  switch (team) {
    case "townsfolk":
      return CHARACTER_ICONS.townsfolk;
    case "outsider":
      return CHARACTER_ICONS.outsider;
    case "minion":
      return CHARACTER_ICONS.minion;
    case "demon":
      return CHARACTER_ICONS.demon;
    case "traveller":
      return CHARACTER_ICONS.traveller;
    case "fabled":
      return CHARACTER_ICONS.fabled;
  }
}

function ensureImageHostname(character: ScriptCharacter, imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    if (ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)) {
      return imageUrl;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Do nothing
  }
  return getFallbackIconUrl(character.team);
}

function getCharacterIconUrl(character: ScriptCharacter): string {
  // Check for images defined in script
  if (typeof character.image === "string") {
    return ensureImageHostname(character, character.image);
  }
  if (Array.isArray(character.image)) {
    switch (character.team) {
      case "townsfolk":
      case "outsider":
        return ensureImageHostname(character, character.image[0]);
      case "minion":
      case "demon":
        return ensureImageHostname(character, character.image[0]);
      case "traveller":
        return ensureImageHostname(character, character.image[0]);
      case "fabled":
        return ensureImageHostname(character, character.image[0]);
    }
  }

  // Role has no image defined, use local image if official character.
  if (CHARACTERS_BY_ID.get(character.id) !== undefined) {
    if (character.team === "traveller") {
      return (
        (CHARACTER_ICONS as Partial<Record<string, string>>)[character.id] ??
        getFallbackIconUrl(character.team)
      );
    }
    if (character.team === "fabled") {
      return (
        (CHARACTER_ICONS as Partial<Record<string, string>>)[character.id] ??
        getFallbackIconUrl(character.team)
      );
    }
    return (
      (CHARACTER_ICONS as Partial<Record<string, string>>)[character.id] ??
      getFallbackIconUrl(character.team)
    );
  }

  // Otherwise return default icon for type
  return getFallbackIconUrl(character.team);
}

export interface CharacterIconProps {
  character: ScriptCharacter;
  className?: string;
}

export const CharacterIcon = memo(function CharacterIcon({
  character,
  className,
}: CharacterIconProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <img
      className={clsx("token-image", className)}
      src={getCharacterIconUrl(character)}
      alt={character.name}
      ref={imgRef}
      onError={() => {
        if (imgRef.current) {
          imgRef.current.src = getFallbackIconUrl(character.team);
        }
      }}
    />
  );
});
