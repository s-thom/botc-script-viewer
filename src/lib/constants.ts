/** Cache time for generated responses. */
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

// Limit script size to 512kB. A script _shouldn't_ be larger than that.
// Fall of Rome, a full homebrew, is 18kB.
export const MAX_SCRIPT_SIZE_BYTES = 512 * 1024;

export const ALLOWED_EXTERNAL_HOSTNAMES = [
  "i.imgur.com",
  "release.botc.app",
  "www.bloodstar.xyz",
  "raw.githubusercontent.com",
];
