import type { OfficialCharacterId } from "../../../generated/types";
import type { CharacterMetadata } from "./types";

export const CHARACTER_METADATA: Record<
  OfficialCharacterId,
  CharacterMetadata
> = {
  washerwoman: {
    edition: "tb",
    actionType: "start-knowing",
  },
  librarian: {
    edition: "tb",
    actionType: "start-knowing",
  },
  investigator: {
    edition: "tb",
    actionType: "start-knowing",
  },
  chef: {
    edition: "tb",
    actionType: "start-knowing",
  },
  empath: {
    edition: "tb",
    actionType: "each-night-all",
  },
  fortuneteller: {
    edition: "tb",
    actionType: "each-night-all",
  },
  undertaker: {
    edition: "tb",
    actionType: "each-night-star",
  },
  monk: {
    edition: "tb",
    actionType: "each-night-star",
    preventsNightDeath: true,
  },
  ravenkeeper: {
    edition: "tb",
    actionType: "on-death",
  },
  virgin: {
    edition: "tb",
    actionType: "once-per-game",
  },
  slayer: {
    edition: "tb",
    actionType: "once-per-game",
  },
  soldier: {
    edition: "tb",
    actionType: "passive",
    preventsNightDeath: true,
  },
  mayor: {
    edition: "tb",
    actionType: "passive",
  },
  butler: {
    edition: "tb",
    actionType: "each-night-all",
  },
  drunk: {
    edition: "tb",
    actionType: "passive",
    causesDroison: true,
  },
  recluse: {
    edition: "tb",
    actionType: "passive",
  },
  saint: {
    edition: "tb",
    actionType: "passive",
    addsExtraEvilWinCondition: true,
  },
  poisoner: {
    edition: "tb",
    actionType: "each-night-all",
    causesDroison: true,
  },
  spy: {
    edition: "tb",
    actionType: "each-night-all",
  },
  scarletwoman: {
    edition: "tb",
    actionType: "passive",
  },
  baron: {
    edition: "tb",
    actionType: "passive",
    outsiderModification: true,
  },
  imp: {
    edition: "tb",
    actionType: "each-night-star",
  },
  bureaucrat: {
    edition: "tb",
    actionType: "traveller",
  },
  thief: {
    edition: "tb",
    actionType: "traveller",
  },
  gunslinger: {
    edition: "tb",
    actionType: "traveller",
  },
  scapegoat: {
    edition: "tb",
    actionType: "traveller",
  },
  beggar: {
    edition: "tb",
    actionType: "traveller",
  },
  grandmother: {
    edition: "bmr",
    actionType: "start-knowing",
  },
  sailor: {
    edition: "bmr",
    actionType: "each-night-all",
    causesDroison: true,
  },
  chambermaid: {
    edition: "bmr",
    actionType: "each-night-all",
  },
  exorcist: {
    edition: "bmr",
    actionType: "each-night-star",
  },
  innkeeper: {
    edition: "bmr",
    actionType: "each-night-star",
    causesDroison: true,
  },
  gambler: {
    edition: "bmr",
    actionType: "each-night-star",
    causesExtraNightDeaths: true,
  },
  gossip: {
    edition: "bmr",
    actionType: "public-claim",
    causesExtraNightDeaths: true,
  },
  courtier: {
    edition: "bmr",
    actionType: "once-per-game",
    causesDroison: true,
  },
  professor: {
    edition: "bmr",
    actionType: "once-per-game",
    causesResurrection: true,
  },
  minstrel: {
    edition: "bmr",
    actionType: "on-death",
    causesDroison: true,
  },
  tealady: {
    edition: "bmr",
    actionType: "passive",
    preventsExecution: true,
    preventsNightDeath: true,
  },
  pacifist: {
    edition: "bmr",
    actionType: "passive",
    preventsExecution: true,
  },
  fool: {
    edition: "bmr",
    actionType: "passive",
    preventsExecution: true,
    preventsNightDeath: true,
  },
  tinker: {
    edition: "bmr",
    actionType: "passive",
    causesExtraNightDeaths: true,
  },
  moonchild: {
    edition: "bmr",
    actionType: "on-death",
    causesExtraNightDeaths: true,
  },
  goon: {
    edition: "bmr",
    actionType: "passive",
    causesExtraEvil: true,
    causesDroison: true,
  },
  lunatic: {
    edition: "bmr",
    actionType: "each-night-star",
  },
  godfather: {
    edition: "bmr",
    actionType: "each-night-star",
    causesExtraNightDeaths: true,
    outsiderModification: true,
  },
  devilsadvocate: {
    edition: "bmr",
    actionType: "each-night-all",
    preventsExecution: true,
  },
  assassin: {
    edition: "bmr",
    actionType: "once-per-game",
    causesExtraNightDeaths: true,
  },
  mastermind: {
    edition: "bmr",
    actionType: "passive",
    addsExtraEvilWinCondition: true,
  },
  zombuul: {
    edition: "bmr",
    actionType: "each-night-star",
  },
  pukka: {
    edition: "bmr",
    actionType: "each-night-star",
    causesDroison: true,
  },
  shabaloth: {
    edition: "bmr",
    actionType: "each-night-star",
    causesExtraNightDeaths: true,
    causesResurrection: true,
  },
  po: {
    edition: "bmr",
    actionType: "each-night-star",
    preventsNightDeath: true,
    causesExtraNightDeaths: true,
  },
  apprentice: {
    edition: "bmr",
    actionType: "traveller",
  },
  matron: {
    edition: "bmr",
    actionType: "traveller",
  },
  judge: {
    edition: "bmr",
    actionType: "traveller",
  },
  bishop: {
    edition: "bmr",
    actionType: "traveller",
  },
  voudon: {
    edition: "bmr",
    actionType: "traveller",
  },
  clockmaker: {
    edition: "snv",
    actionType: "start-knowing",
  },
  dreamer: {
    edition: "snv",
    actionType: "each-night-all",
  },
  snakecharmer: {
    edition: "snv",
    actionType: "each-night-all",
    // Not adding in "causesDroison" because it's more self-droisoning and the player knows it.
  },
  mathematician: {
    edition: "snv",
    actionType: "each-night-all",
  },
  flowergirl: {
    edition: "snv",
    actionType: "each-night-star",
  },
  towncrier: {
    edition: "snv",
    actionType: "each-night-star",
  },
  oracle: {
    edition: "snv",
    actionType: "each-night-star",
  },
  savant: {
    edition: "snv",
    actionType: "storyteller-consult",
  },
  seamstress: {
    edition: "snv",
    actionType: "once-per-game",
  },
  philosopher: {
    edition: "snv",
    actionType: "once-per-game",
    causesDroison: true,
  },
  artist: {
    edition: "snv",
    actionType: "storyteller-consult",
  },
  juggler: {
    edition: "snv",
    actionType: "public-claim",
  },
  sage: {
    edition: "snv",
    actionType: "on-death",
  },
  mutant: {
    edition: "snv",
    actionType: "passive",
    causesMadness: "character",
  },
  sweetheart: {
    edition: "snv",
    actionType: "on-death",
    causesDroison: true,
  },
  barber: {
    edition: "snv",
    actionType: "on-death",
  },
  klutz: {
    edition: "snv",
    actionType: "on-death",
    addsExtraEvilWinCondition: true,
  },
  eviltwin: {
    edition: "snv",
    actionType: "passive",
    addsExtraEvilWinCondition: true,
  },
  witch: {
    edition: "snv",
    actionType: "each-night-all",
  },
  cerenovus: {
    edition: "snv",
    actionType: "each-night-all",
    causesMadness: "character",
  },
  pithag: {
    edition: "snv",
    actionType: "each-night-star",
  },
  fanggu: {
    edition: "snv",
    actionType: "each-night-star",
    causesExtraEvil: true,
  },
  vigormortis: {
    edition: "snv",
    actionType: "each-night-star",
    causesDroison: true,
  },
  nodashii: {
    edition: "snv",
    actionType: "each-night-star",
    causesDroison: true,
  },
  vortox: {
    edition: "snv",
    actionType: "each-night-star",
    causesDroison: true, // Well, it's not droisoning, but it is misinfo.
  },
  barista: {
    edition: "snv",
    actionType: "traveller",
  },
  harlot: {
    edition: "snv",
    actionType: "traveller",
  },
  butcher: {
    edition: "snv",
    actionType: "traveller",
  },
  bonecollector: {
    edition: "snv",
    actionType: "traveller",
  },
  deviant: {
    edition: "snv",
    actionType: "traveller",
  },
  noble: {
    edition: "kickstarter",
    actionType: "start-knowing",
  },
  bountyhunter: {
    edition: "carousel",
    actionType: "each-night-all",
    causesExtraEvil: true,
  },
  pixie: {
    edition: "kickstarter",
    actionType: "start-knowing",
    causesMadness: "character",
  },
  general: {
    edition: "kickstarter",
    actionType: "each-night-all",
  },
  preacher: {
    edition: "carousel",
    actionType: "each-night-all",
  },
  king: {
    edition: "kickstarter",
    actionType: "each-night-star",
  },
  balloonist: {
    edition: "carousel",
    actionType: "each-night-all",
    outsiderModification: true,
  },
  cultleader: {
    edition: "carousel",
    actionType: "public-claim",
    addsExtraEvilWinCondition: true,
    addsExtraGoodWinCondition: true,
    causesExtraEvil: true,
  },
  lycanthrope: {
    edition: "kickstarter",
    actionType: "each-night-star",
    causesExtraNightDeaths: false, // False because it's not on top of what the demon is doing.
  },
  amnesiac: {
    edition: "kickstarter",
    actionType: "storyteller-consult",
    canChangeRules: true,
  },
  nightwatchman: {
    edition: "carousel",
    actionType: "once-per-game",
  },
  engineer: {
    edition: "kickstarter",
    actionType: "once-per-game",
    evilWeight: -0.5,
  },
  fisherman: {
    edition: "carousel",
    actionType: "storyteller-consult",
  },
  huntsman: {
    edition: "kickstarter",
    actionType: "once-per-game",
    requiresCharacters: ["damsel"],
  },
  alchemist: {
    edition: "kickstarter",
    actionType: "start-knowing",
    needsExtraMinion: true,
  },
  farmer: {
    edition: "kickstarter",
    actionType: "on-death",
  },
  magician: {
    edition: "kickstarter",
    actionType: "passive",
  },
  choirboy: {
    edition: "kickstarter",
    actionType: "on-death", // Specifically the King's death
    requiresCharacters: ["king"],
  },
  poppygrower: {
    edition: "kickstarter",
    actionType: "passive",
  },
  atheist: {
    edition: "kickstarter",
    actionType: "passive",
    canChangeRules: true,
  },
  cannibal: {
    edition: "kickstarter",
    actionType: "each-night-star",
    causesDroison: true,
  },
  snitch: {
    edition: "kickstarter",
    actionType: "passive",
  },
  acrobat: {
    edition: "carousel",
    actionType: "each-night-star",
    causesExtraNightDeaths: true,
  },
  puzzlemaster: {
    edition: "kickstarter",
    actionType: "storyteller-consult",
    causesDroison: true,
  },
  heretic: {
    edition: "kickstarter",
    actionType: "passive",
    evilWeight: 0.5,
  },
  damsel: {
    edition: "kickstarter",
    actionType: "passive",
    addsExtraEvilWinCondition: true,
  },
  golem: {
    edition: "kickstarter",
    actionType: "once-per-game",
  },
  politician: {
    edition: "carousel",
    actionType: "passive",
    causesExtraEvil: true,
  },
  widow: {
    edition: "carousel",
    actionType: "once-per-game",
    causesDroison: true,
  },
  fearmonger: {
    edition: "kickstarter",
    actionType: "each-night-star",
    addsExtraEvilWinCondition: true,
  },
  psychopath: {
    edition: "kickstarter",
    actionType: "public-claim",
  },
  goblin: {
    edition: "carousel",
    actionType: "public-claim",
    addsExtraEvilWinCondition: true,
  },
  mezepheles: {
    edition: "kickstarter",
    actionType: "start-knowing",
    causesExtraEvil: true,
  },
  marionette: {
    edition: "kickstarter",
    actionType: "passive",
  },
  boomdandy: {
    edition: "kickstarter",
    actionType: "on-death",
    addsExtraEvilWinCondition: true,
  },
  lilmonsta: {
    edition: "carousel",
    actionType: "each-night-star",
    needsExtraMinion: true,
  },
  lleech: {
    edition: "kickstarter",
    actionType: "each-night-star",
    preventsExecution: true,
  },
  alhadikhia: {
    edition: "kickstarter",
    actionType: "each-night-star",
    causesExtraNightDeaths: true,
    causesResurrection: true,
  },
  legion: {
    edition: "kickstarter",
    actionType: "each-night-star",
  },
  leviathan: {
    edition: "kickstarter",
    actionType: "passive",
  },
  riot: {
    edition: "kickstarter",
    actionType: "passive",
  },
  gangster: {
    edition: "kickstarter",
    actionType: "traveller",
  },
  organgrinder: {
    edition: "carousel",
    actionType: "passive",
  },
  vizier: {
    edition: "carousel",
    actionType: "public-claim",
  },
  knight: {
    edition: "carousel",
    actionType: "start-knowing",
  },
  steward: {
    edition: "carousel",
    actionType: "start-knowing",
  },
  highpriestess: {
    edition: "carousel",
    actionType: "each-night-all",
  },
  harpy: {
    edition: "carousel",
    actionType: "each-night-all",
    causesMadness: "evil",
  },
  plaguedoctor: {
    edition: "carousel",
    actionType: "on-death",
  },
  shugenja: {
    edition: "carousel",
    actionType: "start-knowing",
  },
  ojo: {
    edition: "carousel",
    actionType: "each-night-star",
  },
  hatter: {
    edition: "carousel",
    actionType: "on-death",
  },
  kazali: {
    edition: "carousel",
    actionType: "each-night-star",
  },
  villageidiot: {
    edition: "carousel",
    actionType: "each-night-all",
    causesDroison: true,
  },
  yaggababble: {
    edition: "carousel",
    actionType: "each-night-star",
  },
  summoner: {
    edition: "carousel",
    actionType: "once-per-game",
  },
  banshee: {
    edition: "carousel",
    actionType: "on-death",
  },
  ogre: {
    edition: "carousel",
    actionType: "first-night",
    causesExtraEvil: true,
  },
  alsaahir: {
    edition: "carousel",
    actionType: "public-claim",
    addsExtraGoodWinCondition: true,
  },
  zealot: {
    edition: "carousel",
    actionType: "passive",
  },
  lordoftyphon: {
    edition: "carousel",
    actionType: "each-night-star",
    needsExtraMinion: true,
  },
  boffin: {
    edition: "carousel",
    actionType: "start-knowing",
  },
  gnome: {
    edition: "carousel",
    actionType: "traveller",
  },
  xaan: {
    edition: "carousel",
    actionType: "passive",
    causesDroison: true,
  },
  wizard: {
    edition: "carousel",
    actionType: "once-per-game",
    canChangeRules: true,
  },
  hermit: {
    edition: "carousel",
    actionType: "passive",
  },
  princess: {
    edition: "carousel",
    actionType: "passive",
    preventsNightDeath: true,
  },
  wraith: {
    edition: "carousel",
    actionType: "each-night-all",
  },
  angel: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  bootlegger: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  buddhist: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  deusexfiasco: {
    edition: "carousel",
    actionType: "fabled",
  },
  djinn: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  doomsayer: {
    edition: "kickstarter",
    actionType: "fabled",
    causesExtraNightDeaths: true,
  },
  duchess: {
    edition: "kickstarter",
    actionType: "each-night-star",
  },
  ferryman: {
    edition: "carousel",
    actionType: "fabled",
  },
  fibbin: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  fiddler: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  gardener: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  hellslibrarian: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  revolutionary: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  sentinel: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  spiritofivory: {
    edition: "kickstarter",
    actionType: "fabled",
  },
  stormcatcher: {
    edition: "carousel",
    actionType: "fabled",
  },
  toymaker: {
    edition: "kickstarter",
    actionType: "fabled",
  },
};
