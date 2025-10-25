import type { GlobalState } from "../state/types";

interface BaseCheckAction {
  type: string;
}

export interface AddCharacterAction extends BaseCheckAction {
  type: "add-character";
  id: string;
}

export type CheckAction = AddCharacterAction;

export interface CheckResult {
  id: string;
  level: "error" | "warning" | "info";
  description: string;
  remarks?: string[];
  actions?: CheckAction[];
}

export type Check = (state: GlobalState) => CheckResult | CheckResult[];
