import type { ImageMetadata } from "astro";
import * as APP_ICONS from "../assets/botc";
import type { NormalisedScriptCharacter } from "../types/botc";
import { CHARACTERS_BY_ID } from "./characters";
import { ALLOWED_EXTERNAL_HOSTNAMES } from "./constants";

export function getFallbackIcon(
  team: NormalisedScriptCharacter["team"],
): string {
  return `https://release.botc.app/resources/characters/generic/${team}.webp`;
}

function ensureImageHostname(
  character: NormalisedScriptCharacter,
  imageUrl: string,
): string {
  try {
    const url = new URL(imageUrl);
    if (ALLOWED_EXTERNAL_HOSTNAMES.includes(url.hostname)) {
      return imageUrl;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Do nothing
  }
  return getFallbackIcon(character.team);
}

export function getCharacterIcon(
  character: NormalisedScriptCharacter,
): string | ImageMetadata {
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

  // Role has no image defined, check for special characters first. use local image if official character.
  if (character.edition === "special") {
    return (
      (APP_ICONS as Partial<Record<string, ImageMetadata>>)[character.id] ??
      getFallbackIcon(character.team)
    );
  }

  // If its an official character, use the official icon.
  if (CHARACTERS_BY_ID.has(character.id)) {
    let alignmentSuffix = "";
    switch (character.team) {
      case "townsfolk":
      case "outsider":
        alignmentSuffix = "_g";
        break;
      case "minion":
      case "demon":
        alignmentSuffix = "_e";
        break;
    }

    return `https://release.botc.app/resources/characters/${character.edition}/${character.id}${alignmentSuffix}.webp`;
  }

  // Otherwise return default icon for type
  return getFallbackIcon(character.team);
}
