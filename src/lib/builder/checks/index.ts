import type { GlobalState } from "../state/types";
import { scheduleTask } from "../util/async";
import { ALWAYS_CHECKS } from "./always";
import { CHARACTER_CHECKS } from "./characters";
import { SCRIPT_CHECKS } from "./script";
import type { Check, CheckResult } from "./types";

const ALL_CHECKS: Check[] = [
  ...ALWAYS_CHECKS,
  ...SCRIPT_CHECKS,
  ...CHARACTER_CHECKS,
];

export async function runAllChecks(
  state: GlobalState,
  signal: AbortSignal
): Promise<CheckResult[]> {
  const rawCheckResults = await Promise.all(
    ALL_CHECKS.map((check) => scheduleTask(() => check(state), signal))
  );
  return rawCheckResults.flat().filter((result) => result != null);
}
