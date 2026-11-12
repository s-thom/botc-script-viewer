import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  NormalisedScript,
  NormalisedScriptCharacter,
} from "../../types/botc.ts";
import { createTranslator } from "../i18n/t.ts";
import {
  type DiscordEmbedOptions,
  getDiscordEmbedJson,
} from "./discord-embed.ts";

const t = await createTranslator({ locale: "en" });

const options: DiscordEmbedOptions = {
  viewUrl: "https://example.com/tb/tb/",
  printUrl: "https://example.com/tb/tb/print/",
  imageUrl: "https://example.com/tb/tb/og.png",
};

function character(
  name: string,
  team: NormalisedScriptCharacter["team"],
): NormalisedScriptCharacter {
  return {
    id: name.toLowerCase(),
    normalisedId: name.toLowerCase(),
    name,
    team,
    ability: "",
    isHomebrew: false,
  } as NormalisedScriptCharacter;
}

function makeScript(
  characters: NormalisedScriptCharacter[],
  meta: Partial<NormalisedScript> = {},
): NormalisedScript {
  const teams: NormalisedScript["teams"] = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
    loric: [],
  };
  for (const c of characters) {
    teams[c.team].push(c);
  }
  return {
    name: "Trouble Brewing",
    firstNight: [],
    otherNight: [],
    hasModifiedNightOrder: false,
    characters,
    charactersById: new Map(characters.map((c) => [c.id, c])),
    teams,
    jinxes: [],
    warnings: [],
    interactions: [],
    ...meta,
  };
}

const smallScript = makeScript([
  character("Washerwoman", "townsfolk"),
  character("Librarian", "townsfolk"),
  character("Drunk", "outsider"),
  character("Poisoner", "minion"),
  character("Imp", "demon"),
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function build(script: NormalisedScript, opts = options): any {
  const json = getDiscordEmbedJson(t, script, opts);
  assert.ok(json);
  assert.ok(new TextEncoder().encode(json).byteLength <= 3000);
  return JSON.parse(json);
}

describe("getDiscordEmbedJson", () => {
  it("shows the image and lists every character by team with view and print buttons", () => {
    const { component } = build(
      makeScript(smallScript.characters, { author: "Steven Medway" }),
    );

    assert.equal(component.type, 17);
    assert.equal(component.accent_color, undefined);
    assert.deepEqual(component.components, [
      { type: 10, content: "# Trouble Brewing\nby Steven Medway" },
      {
        type: 12,
        items: [
          {
            media: { url: options.imageUrl },
            description: "Trouble Brewing by Steven Medway",
          },
        ],
      },
      { type: 14 },
      {
        type: 10,
        content:
          "**Townsfolk**\nWasherwoman and Librarian\n**Outsider**\nDrunk\n**Minion**\nPoisoner\n**Demon**\nImp",
      },
      {
        type: 1,
        components: [
          { type: 2, style: 5, label: "View", url: options.viewUrl },
          { type: 2, style: 5, label: "Print", url: options.printUrl },
        ],
      },
    ]);
  });

  it("converts the colour to an integer accent", () => {
    const { component } = build(smallScript, {
      ...options,
      color: "rgb(32, 86, 45)",
    });
    assert.equal(component.accent_color, 0x20562d);
  });

  it("escapes markdown and keeps < out of the raw JSON", () => {
    const json = getDiscordEmbedJson(
      t,
      makeScript([character("<Bad_*Name*>", "townsfolk")], {
        name: "# Title",
      }),
      options,
    );
    assert.ok(json);
    assert.ok(!json.includes("<"));

    const { component } = JSON.parse(json);
    assert.equal(component.components[0].content, "# \\# Title");
    assert.equal(component.components[1].items[0].description, "# Title");
    assert.equal(
      component.components[3].content,
      "**Townsfolk**\n\\<Bad\\_\\*Name\\*\\>",
    );
  });

  it("shows the logo as a thumbnail only from allowed hosts", () => {
    const allowed = build(
      makeScript(smallScript.characters, {
        logo: "https://i.imgur.com/logo.png",
      }),
    );
    assert.deepEqual(allowed.component.components[0].accessory, {
      type: 11,
      media: { url: "https://i.imgur.com/logo.png" },
    });

    const disallowed = build(
      makeScript(smallScript.characters, {
        logo: "https://evil.example.com/logo.png",
      }),
    );
    assert.equal(disallowed.component.components[0].type, 10);
  });

  it("shortens team lists to fit the size limit", () => {
    const characters = Array.from({ length: 200 }, (_, i) =>
      character(`Townsfolk Character ${i}`, "townsfolk"),
    );
    const { component } = build(makeScript(characters));
    const teams: string = component.components[3].content;

    assert.match(teams, /Townsfolk Character 0, /);
    assert.match(teams, /and \d+ more$/);
    assert.doesNotMatch(teams, /Townsfolk Character 199/);
  });

  it("drops buttons whose URLs are too long", () => {
    const { component } = build(smallScript, {
      ...options,
      printUrl: `https://example.com/${"a".repeat(600)}/print/`,
    });
    assert.deepEqual(component.components.at(-1).components, [
      { type: 2, style: 5, label: "View", url: options.viewUrl },
    ]);
  });

  it("drops the image when its URL is too long", () => {
    const { component } = build(smallScript, {
      ...options,
      imageUrl: `https://example.com/${"a".repeat(2100)}/og.png`,
    });
    assert.ok(
      component.components.every(({ type }: { type: number }) => type !== 12),
    );
  });

  it("returns undefined when it can't fit", () => {
    assert.equal(
      getDiscordEmbedJson(
        t,
        makeScript(smallScript.characters, { name: "x".repeat(4000) }),
        options,
      ),
      undefined,
    );
  });
});
