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
import type { Translator } from "../i18n/types";
import { applyNormalisedScriptFallbacks, normaliseScript } from "../normalise";
import {
  BYLINE_FONT_SIZE,
  BYLINE_GAP,
  BYLINE_LINE_HEIGHT,
  chooseLayout,
  fitTitle,
  getHeaderHeight,
  getIconRows,
  HEADER_PADDING_BOTTOM,
  HEADER_PADDING_INLINE,
  HEADER_PADDING_TOP,
  HEADER_PAPER_EDGE,
  ICON_AREA_PADDING,
  ICON_GAP,
  ICON_SIZE,
  OG_HEIGHT,
  OG_WIDTH,
  TITLE_LINE_HEIGHT,
  TITLE_MAX_FONT_SIZE,
  TITLE_MAX_WIDTH,
  type TitleFit,
} from "./layout";

export interface OgImageInput {
  t: Translator;
  rawScript: BloodOnTheClocktowerCustomScript;
  color?: string;
  fallbacks?: NormalisedScriptFallbacks;
}

export type IconLoader = (
  character: NormalisedScriptCharacter,
) => Promise<Uint8Array>;

const TITLE_FONT = "Dumbledor";
const BYLINE_FONT = "Sorts Mill Goudy";

const DEFAULT_HEADER_COLOR = "#20562d";
const HEADER_TEXT_COLOR = "#fdedc9";
const HEADER_PAPER_COLOR = "#fffdf4";
const BACKGROUND_COLOR = "#e6e3da";

const CCC_WIDTH = 189;
const CCC_HEIGHT = 71;
const CCC_INSET = 24;

const PAPER_SRC = "og:paper";
const FERNS_SRC = "og:ferns";
const CCC_SRC = "og:ccc";

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

function iconSrc(character: NormalisedScriptCharacter) {
  return `og:icon:${character.id}`;
}

function titleBlock(title: string, fit: TitleFit, byline?: string): Node[] {
  const nodes: Node[] = [
    {
      type: "text",
      text: title,
      style: {
        fontFamily: TITLE_FONT,
        fontSize: `${fit.fontSize}px`,
        lineHeight: TITLE_LINE_HEIGHT,
        maxWidth: `${TITLE_MAX_WIDTH}px`,
        textAlign: "center",
        lineClamp: fit.lineCount,
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

function headerPattern(headerColor: string) {
  return {
    backgroundColor: headerColor,
    backgroundImage: `url(${FERNS_SRC})`,
    backgroundBlendMode: "multiply",
    color: HEADER_TEXT_COLOR,
  } as const;
}

function iconRows(rows: NormalisedScriptCharacter[][]): Node {
  return {
    type: "container",
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flexGrow: 1,
      gap: `${ICON_GAP}px`,
      padding: `${ICON_AREA_PADDING}px 0`,
    },
    children: rows.map((row) => ({
      type: "container",
      style: {
        display: "flex",
        justifyContent: "center",
        gap: `${ICON_GAP}px`,
      },
      children: row.map((character) => ({
        type: "image",
        src: iconSrc(character),
        width: ICON_SIZE,
        height: ICON_SIZE,
      })),
    })),
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
  { t, rawScript, color, fallbacks }: OgImageInput,
  loadIcon: IconLoader,
): Promise<Uint8Array<ArrayBuffer>> {
  const script = normaliseScript(rawScript, t);
  if (fallbacks) {
    applyNormalisedScriptFallbacks(script, fallbacks);
  }

  const title = script.name || t.string("viewer.script.untitledScript").value;
  const byline = script.author
    ? t.string("viewer.script.byAuthor", { author: script.author }).value
    : undefined;
  const headerColor =
    getHeaderColor(color ?? script.color) ?? DEFAULT_HEADER_COLOR;

  const renderer = await getRenderer();
  const titleFit = await measureTitle(renderer, title);
  const rows = getIconRows(script.teams);
  const layout = chooseLayout(
    rows.length,
    getHeaderHeight(titleFit, byline !== undefined),
  );

  const images = [...getStaticImages()];
  let content: Node[];

  if (layout === "icons") {
    const icons = await Promise.all(
      rows.flat().map(async (character) => ({
        src: iconSrc(character),
        data: await loadIcon(character),
      })),
    );
    images.push(...icons);

    content = [
      {
        type: "container",
        style: {
          display: "flex",
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
              ...headerPattern(headerColor),
            },
            children: titleBlock(title, titleFit, byline),
          },
        ],
      },
      iconRows(rows),
    ];
  } else {
    content = [
      {
        type: "container",
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          padding: `0 ${HEADER_PADDING_INLINE}px`,
          ...headerPattern(headerColor),
        },
        children: titleBlock(title, titleFit, byline),
      },
    ];
  }

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
      children: [...content, cccLogoNode()],
    },
    { width: OG_WIDTH, height: OG_HEIGHT, format: "png", images },
  );
}
