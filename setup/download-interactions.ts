import { unzip } from "fflate";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { OfficialCharacterId } from "../src/generated/types.ts";
import { roles } from "../src/lib/data.ts";
import {
  STATUSES,
  type CharacterGroup,
  type ExtraInteraction,
  type HermitInteractionNested,
  type HermitInteractions,
  type RoleMatchups,
  type StatusBlock,
} from "../src/types/interactions.ts";

const ZIP_URL =
  "https://github.com/LeCodex/botc-interactions/archive/refs/heads/main.zip";
const DESTINATION_DIR = "src/generated/interactions";
const ZIP_PREFIX = "botc-interactions-main/";

const FILES = ["matchups", "hermit", "extra", "groups"] as const;
const FULL_FILE_PATHS = new Set(
  FILES.map((filename) => `${ZIP_PREFIX}${filename}.json`),
);

function roleNameToId(name: string): OfficialCharacterId | undefined {
  return roles.find((role) => role.name === name)?.id as OfficialCharacterId;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function isStatusBlock(data: any): data is StatusBlock {
  if (typeof data !== "object") {
    return false;
  }

  const keys = Object.keys(data);
  if (keys.length === 0) {
    return false;
  }

  for (const key of keys) {
    if (!STATUSES.includes(key as never)) {
      return false;
    }
    if (typeof data[key] !== "string") {
      return false;
    }
  }

  return true;
}

function transformMatchups(data: any): RoleMatchups {
  const result: RoleMatchups = {};

  for (const [role1Name, dict] of Object.entries(data)) {
    const role1Id = roleNameToId(role1Name);
    if (!role1Id) {
      console.warn(`Matchups referenced unknown character name ${role1Name}`);
      continue;
    }

    const resultDict: RoleMatchups[OfficialCharacterId] = {};
    result[role1Id] = resultDict;

    for (const [role2Name, interactions] of Object.entries(dict as any)) {
      const role2Id = roleNameToId(role2Name);
      if (!role2Id) {
        console.warn(
          `Matchups referenced unknown character name ${role2Name} (in ${role1Name})`,
        );
        continue;
      }

      resultDict[role2Id] = interactions as any;
    }
  }

  return result;
}

function transformHermit(data: any): HermitInteractions {
  if (isStatusBlock(data)) {
    return data;
  }

  const result: HermitInteractionNested = {};

  for (const [roleName, interactions] of Object.entries(data)) {
    const roleId = roleNameToId(roleName);
    if (!roleId) {
      console.warn(`Hermit referenced unknown character name ${roleName}`);
      continue;
    }

    result[roleId] = transformHermit(interactions);
  }

  return result;
}

function transformExtra(data: any): ExtraInteraction[] {
  const result: ExtraInteraction[] = [];

  for (const item of data) {
    const characters = [] as OfficialCharacterId[];

    for (const roleName of item.characters) {
      const roleId = roleNameToId(roleName);
      if (!roleId) {
        console.warn(
          `Extra interaction referenced unknown character name ${roleName}`,
        );
        continue;
      }

      characters.push(roleId);
    }

    result.push({ interaction: item.interaction, characters });
  }

  return result;
}

function transformGroups(data: any): CharacterGroup[] {
  const result: CharacterGroup[] = [];

  for (const group of data) {
    const characters = [] as OfficialCharacterId[];

    for (const roleName of group.characters) {
      const roleId = roleNameToId(roleName);
      if (!roleId) {
        console.warn(`Groups referenced unknown character name ${roleName}`);
        continue;
      }

      characters.push(roleId);
    }

    result.push({
      name: group.name,
      recommended: group.recommended,
      multiple: group.multiple,
      not_only_good: group.not_only_good,
      characters,
    });
  }

  return result;
}

const TRANSFORM_MAP: Record<(typeof FILES)[number], (data: any) => any> = {
  matchups: transformMatchups,
  hermit: transformHermit,
  extra: transformExtra,
  groups: transformGroups,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function downloadInteractions() {
  console.log("Downloading interactions zip...");
  const res = await fetch(ZIP_URL);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const buffer = new Uint8Array(await res.arrayBuffer());
  console.log("Downloaded interactions zip, extracting...");

  const extracted = await new Promise<Record<string, Uint8Array>>(
    (resolve, reject) => {
      unzip(
        buffer,
        { filter: (file) => FULL_FILE_PATHS.has(file.name) },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        },
      );
    },
  );

  await mkdir(DESTINATION_DIR, { recursive: true });

  for (const file of FILES) {
    const key = `${ZIP_PREFIX}${file}.json`;
    const content = extracted[key];
    if (!content) {
      console.warn(`Missing ${file} in zip`);
      continue;
    }

    const jsonString = new TextDecoder().decode(content);
    const json = JSON.parse(jsonString);

    const transformed = TRANSFORM_MAP[file](json);

    const str = JSON.stringify(transformed);

    await writeFile(join(DESTINATION_DIR, `${file}.json`), str);
    console.log(`Saved ${file}`);
  }
}
