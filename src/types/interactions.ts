import type { OfficialCharacterId } from "../generated/types.ts";

export const STATUSES = [
  "great",
  "good",
  "info",
  "warning",
  "conflict",
] as const;
export type InteractionStatus = (typeof STATUSES)[number];

export type StatusBlock = Partial<Record<InteractionStatus, string>>;

export type HermitInteractionNested = {
  [property in OfficialCharacterId]?: HermitInteractions;
};
export type HermitInteractions = HermitInteractionNested | StatusBlock;

export function isStatusBlock(data: object): data is StatusBlock {
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
    if (typeof (data as never)[key] !== "string") {
      return false;
    }
  }

  return true;
}

export interface ExtraInteraction {
  interaction: StatusBlock;
  characters: OfficialCharacterId[];
}

export interface CharacterGroup {
  name: string;
  recommended: boolean;
  multiple: boolean;
  not_only_good: boolean;
  characters: OfficialCharacterId[];
}

export type RoleMatchups = {
  [property in OfficialCharacterId]?: {
    [property in OfficialCharacterId]?: StatusBlock;
  };
};
