import { getImage } from "astro:assets";
import * as imageMetadata from "../../generated/character-icons";
import type { CharacterTeam } from "../../generated/script-schema";
import type { NormalisedScriptCharacter } from "../../types/botc";

const IMAGE_SIZE = 32;
const MAX_PER_ROW = 8;

async function getImageElement(
  character: NormalisedScriptCharacter,
  currentUrl: URL,
): Promise<string> {
  const metadata =
    imageMetadata[character.id as keyof typeof imageMetadata] ??
    imageMetadata[character.team];

  const imageResult = await getImage({ src: metadata, width: IMAGE_SIZE });
  const buffer = await (
    await fetch(new URL(imageResult.src, currentUrl.origin))
  ).bytes();

  const imageBase64 = Buffer.from(buffer).toString("base64");

  return `<image x="0" y="0" width="${IMAGE_SIZE}px" height="${IMAGE_SIZE}px" xlink:href="data:image/png;base64,${imageBase64}"/>`;
}

async function getCharacterRows(
  characters: NormalisedScriptCharacter[],
  currentUrl: URL,
): Promise<{ width: number; height: number; content: string }> {
  const sets = Array.from(
    { length: Math.ceil(characters.length / MAX_PER_ROW) },
    (_, i) => characters.slice(i * MAX_PER_ROW, i * MAX_PER_ROW + MAX_PER_ROW),
  );

  const max = sets.reduce((max, set) => Math.max(max, set.length), 0);
  const totalWidth = max * IMAGE_SIZE;
  const totalHeight = sets.length * IMAGE_SIZE;

  const imageSets = await Promise.all(
    sets.map(async (set, i) => {
      const allImages = await Promise.all(
        set.map(async (character, j) => {
          const image = await getImageElement(character, currentUrl);

          return `<svg x="${j * IMAGE_SIZE}px">${image}</svg>`;
        }),
      );

      const xOffset = (totalWidth - allImages.length * IMAGE_SIZE) / 2;

      return `<svg x="${xOffset}px" y="${i * IMAGE_SIZE}px">${allImages.join("")}</svg>`;
    }),
  );

  return {
    width: totalWidth,
    height: totalHeight,
    content: imageSets.join(""),
  };
}

export async function getCharacterIconArea(
  charactersByType: Partial<Record<CharacterTeam, NormalisedScriptCharacter[]>>,
  currentUrl: URL,
): Promise<{ width: number; height: number; content: string }> {
  const npcs = ([] as NormalisedScriptCharacter[]).concat(
    charactersByType.fabled ?? [],
    charactersByType.loric ?? [],
  );

  const typesToAdd = [
    npcs,
    charactersByType.townsfolk ?? [],
    charactersByType.outsider ?? [],
    charactersByType.minion ?? [],
    charactersByType.demon ?? [],
  ].filter((type) => type.length > 0);

  const rows = await Promise.all(
    typesToAdd.map((type) => getCharacterRows(type, currentUrl)),
  );

  const maxWidth = rows.reduce((max, row) => Math.max(max, row.width), 0);

  let currentY = 0;
  const elements = rows.map((row) => {
    const xOffset = (maxWidth - row.width) / 2;

    const element = `<svg x="${xOffset}px" y="${currentY}px">${row.content}</svg>`;

    currentY += row.height;
    return element;
  });

  return {
    width: maxWidth,
    height: currentY,
    content: elements.join(""),
  };
}
