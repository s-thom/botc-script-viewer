import initTakumi, {
  Renderer,
  type ImageSource,
  type Node,
} from "@takumi-rs/wasm";
import takumiWasm from "@takumi-rs/wasm/auto";
import cccLogo from "../../assets/ccc.png?inline";
import dumbledorFont from "../../assets/fonts/Dumbledor/Dumbledor-Regular.woff2?inline";
import goudyFont from "../../assets/fonts/SortsMillGoudy/SortsMillGoudy-Regular.woff2?inline";
import headerFerns from "../../assets/header-ferns.webp?inline";
import paper from "../../assets/paper2.webp?inline";
import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import type {
  NormalisedScriptCharacter,
  NormalisedScriptFallbacks,
} from "../../types/botc";
import { getHeaderColor } from "../color";
import { getAllowedImageUrl } from "../external-image";
import type { Translator } from "../i18n/types";
import { applyNormalisedScriptFallbacks, normaliseScript } from "../normalise";
import {
  BYLINE_FONT_SIZE,
  BYLINE_GAP,
  BYLINE_LINE_HEIGHT,
  fitTitle,
  getHeaderHeight,
  HEADER_PADDING_BOTTOM,
  HEADER_PADDING_INLINE,
  HEADER_PADDING_TOP,
  HEADER_PAPER_EDGE,
  layoutGrimoire,
  OG_HEIGHT,
  OG_WIDTH,
  TITLE_LINE_HEIGHT,
  TITLE_MAX_FONT_SIZE,
  TITLE_MAX_WIDTH,
  type LogoBox,
  type PlacedToken,
} from "./layout";

export interface OgImageInput {
  t: Translator;
  rawScript: BloodOnTheClocktowerCustomScript;
  color?: string;
  fallbacks?: NormalisedScriptFallbacks;
  featuredCharacters?: string[];
}

export type IconLoader = (
  character: NormalisedScriptCharacter,
) => Promise<Uint8Array>;

export type LogoLoader = (url: string) => Promise<Uint8Array>;

export interface OgImageLoaders {
  icon: IconLoader;
  logo: LogoLoader;
}

const TITLE_FONT = "Dumbledor";
const BYLINE_FONT = "Sorts Mill Goudy";

const DEFAULT_HEADER_COLOR = "#20562d";
const HEADER_TEXT_COLOR = "#fdedc9";
const HEADER_PAPER_COLOR = "#fffdf4";
const BACKGROUND_COLOR = "#e6e3da";
const TOKEN_COLOR = "#f3ead6";
const TOKEN_RIM_COLOR = "#6b5638";
const TOKEN_TEXT_COLOR = "#3b2f20";
const TOKEN_SHADOW = "0 2px 5px rgba(0, 0, 0, 0.35)";

const CCC_WIDTH = 189;
const CCC_HEIGHT = 71;
const CCC_INSET = 24;

const PAPER_SRC = "og:paper";
const FERNS_SRC = "og:ferns";
const CCC_SRC = "og:ccc";
const LOGO_SRC = "og:logo";

const HEADER_CLIP_PATH = `polygon(0 0, 0 100%, 10% calc(100% - 10px), 20% calc(100% - 3px), 30% calc(100% - 12px), 40% calc(100% - 14px), 50% calc(100% - 8px), 60% calc(100% - 11px), 70% calc(100% - 7px), 80% calc(100% - 4px), 90% calc(100% - 9px), 100% calc(100% - 6px), 100% 0)`;

let rendererPromise: Promise<Renderer> | undefined;
let staticImages: ImageSource[] | undefined;

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getRenderer(): Promise<Renderer> {
  rendererPromise ??= (async () => {
    await initTakumi({ module_or_path: takumiWasm });
    const renderer = new Renderer();
    await renderer.registerFont({
      name: TITLE_FONT,
      data: dataUrlToBytes(dumbledorFont),
    });
    await renderer.registerFont({
      name: BYLINE_FONT,
      data: dataUrlToBytes(goudyFont),
    });
    return renderer;
  })().catch((err: unknown) => {
    rendererPromise = undefined;
    throw err;
  });
  return rendererPromise;
}

function getStaticImages(): ImageSource[] {
  staticImages ??= [
    { src: PAPER_SRC, data: dataUrlToBytes(paper) },
    { src: FERNS_SRC, data: dataUrlToBytes(headerFerns) },
    { src: CCC_SRC, data: dataUrlToBytes(cccLogo) },
  ];
  return staticImages;
}

async function measureTitle(renderer: Renderer, title: string) {
  const measured = await renderer.measure(
    {
      type: "container",
      style: { display: "flex" },
      children: [
        {
          type: "text",
          text: title,
          style: {
            fontFamily: TITLE_FONT,
            fontSize: `${TITLE_MAX_FONT_SIZE}px`,
            whiteSpace: "nowrap",
          },
        },
      ],
    },
    { width: OG_WIDTH, height: OG_HEIGHT },
  );
  return fitTitle(measured.children[0]?.width ?? 0, TITLE_MAX_FONT_SIZE);
}

async function loadLogo(
  renderer: Renderer,
  loadLogoBytes: LogoLoader,
  logo: string | undefined,
): Promise<{ image: ImageSource; aspectRatio: number } | undefined> {
  const url = getAllowedImageUrl(logo);
  if (!url) {
    return undefined;
  }

  try {
    const image = { src: LOGO_SRC, data: await loadLogoBytes(url) };
    const measured = await renderer.measure(
      {
        type: "container",
        style: { display: "flex" },
        children: [{ type: "image", src: LOGO_SRC }],
      },
      { width: OG_WIDTH, height: OG_HEIGHT, images: [image] },
    );
    const { width = 0, height = 0 } = measured.children[0] ?? {};
    return width > 0 && height > 0
      ? { image, aspectRatio: width / height }
      : undefined;
  } catch (err) {
    console.warn(`Not using OpenGraph logo ${url}`, err);
    return undefined;
  }
}

function iconSrc(character: NormalisedScriptCharacter) {
  return `og:icon:${character.id}`;
}

function titleBlock(title: string, fontSize: number, byline?: string): Node[] {
  const nodes: Node[] = [
    {
      type: "text",
      text: title,
      style: {
        fontFamily: TITLE_FONT,
        fontSize: `${fontSize}px`,
        lineHeight: TITLE_LINE_HEIGHT,
        maxWidth: `${TITLE_MAX_WIDTH}px`,
        textAlign: "center",
        lineClamp: 1,
        textOverflow: "ellipsis",
      },
    },
  ];
  if (byline) {
    nodes.push({
      type: "text",
      text: byline,
      style: {
        fontFamily: BYLINE_FONT,
        fontSize: `${BYLINE_FONT_SIZE}px`,
        lineHeight: BYLINE_LINE_HEIGHT,
        marginTop: `${BYLINE_GAP}px`,
        maxWidth: `${TITLE_MAX_WIDTH}px`,
        textAlign: "center",
        lineClamp: 1,
        textOverflow: "ellipsis",
      },
    });
  }
  return nodes;
}

function headerNode(
  title: string,
  titleFontSize: number,
  headerColor: string,
  byline?: string,
): Node {
  return {
    type: "container",
    style: {
      display: "flex",
      flexShrink: 0,
      backgroundColor: HEADER_PAPER_COLOR,
      paddingBottom: `${HEADER_PAPER_EDGE}px`,
      clipPath: HEADER_CLIP_PATH,
    },
    children: [
      {
        type: "container",
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
          padding: `${HEADER_PADDING_TOP}px ${HEADER_PADDING_INLINE}px ${HEADER_PADDING_BOTTOM}px`,
          clipPath: HEADER_CLIP_PATH,
          backgroundColor: headerColor,
          backgroundImage: `url(${FERNS_SRC})`,
          backgroundBlendMode: "multiply",
          color: HEADER_TEXT_COLOR,
        },
        children: titleBlock(title, titleFontSize, byline),
      },
    ],
  };
}

function tokenNode(token: PlacedToken<NormalisedScriptCharacter>): Node {
  const rim = Math.max(1, Math.round(token.size / 30));
  let children: Node[] = [];
  if (token.kind === "character") {
    children = [
      {
        type: "image",
        src: iconSrc(token.character),
        width: token.size - 2 * rim,
        height: token.size - 2 * rim,
      },
    ];
  } else if (token.kind === "more") {
    children = [
      {
        type: "text",
        text: `+${token.count}`,
        style: {
          fontFamily: TITLE_FONT,
          fontSize: `${Math.round(token.size * 0.4)}px`,
          color: TOKEN_TEXT_COLOR,
        },
      },
    ];
  }

  return {
    type: "container",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: `${token.x - token.size / 2}px`,
      top: `${token.y - token.size / 2}px`,
      width: `${token.size}px`,
      height: `${token.size}px`,
      borderRadius: "50%",
      border: `${rim}px solid ${TOKEN_RIM_COLOR}`,
      backgroundColor: TOKEN_COLOR,
      boxShadow: TOKEN_SHADOW,
    },
    children,
  };
}

function logoNode(box: LogoBox): Node {
  return {
    type: "image",
    src: LOGO_SRC,
    width: box.width,
    height: box.height,
    style: {
      position: "absolute",
      left: `${box.x}px`,
      top: `${box.y}px`,
      objectFit: "contain",
    },
  };
}

function cccLogoNode(): Node {
  return {
    type: "image",
    src: CCC_SRC,
    width: CCC_WIDTH,
    height: CCC_HEIGHT,
    style: {
      position: "absolute",
      right: `${CCC_INSET}px`,
      bottom: `${CCC_INSET}px`,
    },
  };
}

export async function renderOgImage(
  { t, rawScript, color, fallbacks, featuredCharacters = [] }: OgImageInput,
  loaders: OgImageLoaders,
): Promise<Uint8Array<ArrayBuffer>> {
  const script = normaliseScript(rawScript, t);
  if (fallbacks) {
    applyNormalisedScriptFallbacks(script, fallbacks);
  }

  const featured = featuredCharacters.map((id) => {
    const character = script.charactersById.get(id);
    if (!character) {
      throw new Error(`Featured character ${id} is not on the script`);
    }
    return character;
  });

  const title = script.name || t.string("viewer.script.untitledScript").value;
  const byline = script.author
    ? t.string("viewer.script.byAuthor", { author: script.author }).value
    : undefined;
  const headerColor =
    getHeaderColor(color ?? script.color) ?? DEFAULT_HEADER_COLOR;

  const renderer = await getRenderer();
  const titleFontSize = await measureTitle(renderer, title);
  const logo = await loadLogo(renderer, loaders.logo, script.logo);

  const layout = layoutGrimoire({
    teams: script.teams,
    featured,
    headerHeight: getHeaderHeight(titleFontSize, byline !== undefined),
    logoAspectRatio: logo?.aspectRatio,
  });

  const characters = new Map<string, NormalisedScriptCharacter>();
  for (const token of layout.tokens) {
    if (token.kind === "character") {
      characters.set(token.character.id, token.character);
    }
  }
  const icons = await Promise.all(
    [...characters.values()].map(async (character) => ({
      src: iconSrc(character),
      data: await loaders.icon(character),
    })),
  );

  const images = [...getStaticImages(), ...icons];
  const children: Node[] = [
    headerNode(title, titleFontSize, headerColor, byline),
    ...layout.tokens.map(tokenNode),
  ];
  if (logo && layout.logo) {
    images.push(logo.image);
    children.push(logoNode(layout.logo));
  }
  children.push(cccLogoNode());

  return renderer.render(
    {
      type: "container",
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: BACKGROUND_COLOR,
        backgroundImage: `url(${PAPER_SRC})`,
        backgroundBlendMode: "multiply",
      },
      children,
    },
    { width: OG_WIDTH, height: OG_HEIGHT, format: "png", images },
  );
}
