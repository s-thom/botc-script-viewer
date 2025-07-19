import { clsx } from "clsx";
import { memo, useRef } from "react";
import * as CHARACTER_ICONS from "../../generated/character-icons";
import type { ScriptCharacter } from "../../generated/script-schema";
import type { Alignment } from "../../types/botc";
import { CHARACTERS_BY_ID } from "../../util/characters";
import { defaultAlignmentForTeam } from "../../util/teams";

const ALLOWED_EXTERNAL_HOSTNAMES = ["release.botc.app", "i.imgur.com"];

function getFallbackIconUrl(
  team: ScriptCharacter["team"],
  alignment: Alignment,
): string {
  switch (team) {
    case "townsfolk":
      return alignment === "evil"
        ? CHARACTER_ICONS.townsfolk_e
        : CHARACTER_ICONS.townsfolk_g;
    case "outsider":
      return alignment === "evil"
        ? CHARACTER_ICONS.outsider_e
        : CHARACTER_ICONS.outsider_g;
    case "minion":
      return alignment === "good"
        ? CHARACTER_ICONS.minion_g
        : CHARACTER_ICONS.minion_e;
    case "demon":
      return alignment === "good"
        ? CHARACTER_ICONS.demon_g
        : CHARACTER_ICONS.demon_e;
    case "traveller":
      return alignment === "neutral"
        ? CHARACTER_ICONS.traveller
        : alignment === "good"
          ? CHARACTER_ICONS.traveller_g
          : CHARACTER_ICONS.traveller_e;
    case "fabled":
      return CHARACTER_ICONS.fabled;
  }
}

function ensureImageHostname(
  character: ScriptCharacter,
  alignment: Alignment,
  imageUrl: string,
) {
  try {
    const url = new URL(imageUrl);
    if (ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)) {
      return imageUrl;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Do nothing
  }
  return getFallbackIconUrl(character.team, alignment);
}

function getCharacterIconUrl(
  character: ScriptCharacter,
  alignment: Alignment,
): string {
  // Check for images defined in script
  if (typeof character.image === "string") {
    return ensureImageHostname(character, alignment, character.image);
  }
  if (Array.isArray(character.image)) {
    switch (character.team) {
      case "townsfolk":
      case "outsider":
        switch (alignment) {
          case "good":
            return ensureImageHostname(
              character,
              alignment,
              character.image[0],
            );
          case "evil":
            return ensureImageHostname(
              character,
              alignment,
              character.image[1],
            );
          default:
        }
        break;
      case "minion":
      case "demon":
        switch (alignment) {
          case "good":
            return ensureImageHostname(
              character,
              alignment,
              character.image[1],
            );
          case "evil":
            return ensureImageHostname(
              character,
              alignment,
              character.image[0],
            );
          default:
        }
        break;
      case "traveller":
        switch (alignment) {
          case "neutral":
            return ensureImageHostname(
              character,
              alignment,
              character.image[0],
            );
          case "good":
            return ensureImageHostname(
              character,
              alignment,
              character.image[1],
            );
          case "evil":
            return ensureImageHostname(
              character,
              alignment,
              character.image[2],
            );
          default:
        }
        break;
      case "fabled":
        return character.image[0];
    }
  }

  // Role has no image defined, use local image if official character.
  if (CHARACTERS_BY_ID.get(character.id) !== undefined) {
    if (character.team === "traveller") {
      return (
        (CHARACTER_ICONS as Partial<Record<string, string>>)[
          `${character.id}${alignment === "neutral" ? "" : alignment === "good" ? "_g" : "_e"}`
        ] ?? getFallbackIconUrl(character.team, alignment)
      );
    }
    if (character.team === "fabled") {
      return (
        (CHARACTER_ICONS as Partial<Record<string, string>>)[character.id] ??
        getFallbackIconUrl(character.team, alignment)
      );
    }
    return (
      (CHARACTER_ICONS as Partial<Record<string, string>>)[
        `${character.id}${alignment === "good" ? "_g" : "_e"}`
      ] ?? getFallbackIconUrl(character.team, alignment)
    );
  }

  // Otherwise return default icon for type
  return getFallbackIconUrl(character.team, alignment);
}

export interface CharacterIconProps {
  character: ScriptCharacter;
  alignment?: Alignment;
  className?: string;
}

export const CharacterIcon = memo(function CharacterIcon({
  character,
  alignment,
  className,
}: CharacterIconProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const resolvedAlignment =
    alignment ?? defaultAlignmentForTeam(character.team);

  return (
    <img
      className={clsx("token-image", className)}
      src={getCharacterIconUrl(character, resolvedAlignment)}
      alt={`${character.name} (${resolvedAlignment})`}
      ref={imgRef}
      onError={() => {
        if (imgRef.current) {
          imgRef.current.src = getFallbackIconUrl(
            character.team,
            resolvedAlignment,
          );
        }
      }}
    />
  );
});
