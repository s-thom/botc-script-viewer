import cccBase64 from "../../assets/ccc.png?base64";
import ogHeaderBase64 from "../../assets/og-header.png?base64";
import ogPaperBase64 from "../../assets/og-paper.png?base64";
import type { NormalisedScript } from "../../types/botc";
import type { Translator } from "../i18n";
import { getCharacterIconArea } from "./images";

export function getHomeBannerSvg(t: Translator) {
  return getBigHeaderSvg(`
    <text x="640" y="150" text-anchor="middle" class="title" font-size="64" font-weight="bold" fill="#fdedc9">
      ${t.string("viewer.common.nameLongFirst").value}
    </text>
    <text x="640" y="230" text-anchor="middle" class="title" font-size="64" font-weight="bold" fill="#fdedc9">
      ${t.string("viewer.common.nameLongLast").value}
    </text>
  `);
}

export async function getScriptBannerSvg(
  t: Translator,
  normalisedScript: NormalisedScript,
  baseUrl: URL,
  overrideTitle?: string,
) {
  const parts = [
    `<text x="640" y="78" text-anchor="middle" class="title" font-size="56" font-weight="bold" fill="#fdedc9">
      ${t.string("viewer.common.nameLong").value}
    </text>`,
  ];

  const title =
    overrideTitle ??
    normalisedScript.name ??
    t.string("viewer.script.untitledScript").value;
  let titleHeight = 330;

  // Add character icons if there aren't too many, or too many of a particular type.
  if (normalisedScript.characters.length <= 32) {
    const charactersByType = Object.groupBy(
      normalisedScript.characters,
      (c) => c.team,
    );
    if (Object.values(charactersByType).every((type) => type.length <= 15)) {
      titleHeight = 195;

      const CHARACTER_CENTER_X = 640;
      const CHARACTER_CENTER_Y = 440;

      const characterArea = await getCharacterIconArea(
        charactersByType,
        baseUrl,
      );

      const charactersX = CHARACTER_CENTER_X - characterArea.width / 2;
      const charactersY = CHARACTER_CENTER_Y - characterArea.height / 2;

      parts.push(
        `<svg x="${charactersX}px" y="${charactersY}px">${characterArea.content}</svg>`,
      );
    }
  }

  if (normalisedScript.author) {
    parts.push(`
      <text x="640" y="${titleHeight}" text-anchor="middle" class="title" font-size="56" font-weight="bold" fill="#282828"><![CDATA[${title.replace(/\]\]>/g, "")}]]></text>
      <text x="640" y="${titleHeight + 45}" text-anchor="middle" class="title" font-size="32" font-weight="bold" fill="#282828"><![CDATA[${normalisedScript.author.replace(/\]\]>/g, "")}]]></text>
    `);
  } else {
    parts.push(
      `<text x="640" y="${titleHeight + 20}" text-anchor="middle" class="title" font-size="56" font-weight="bold" fill="#282828"><![CDATA[${title.replace(/\]\]>/g, "")}]]></text>`,
    );
  }

  return getSmallHeaderSvg(parts.join(""));
}

function getJaggedClipPath(id: string, height: number) {
  return `
<clipPath id="${id}"><path d="M0,0l1280,0l0,${height}l-27.632,-0.458l-155.339,3.891l-302.854,-4.807l-157.851,1.763l-145.738,-3.563l-153.374,1.055l-148.452,6.239l-155.858,-4.915l-32.902,1.481Z"/></clipPath>
  `;
}

function getBigHeaderSvg(content: string): string {
  const headerHeight = 424;

  return `
<svg viewBox="0 0 1280 640" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
    <image x="0" y="0" width="1280px" height="640px" xlink:href="data:image/png;base64,${ogPaperBase64}"/>
    ${getJaggedClipPath("clip_edge", headerHeight + 16)}
    ${getJaggedClipPath("clip_header", headerHeight)}
    <g x="0" y="16px" clip-path="url(#clip_edge)">
        <rect x="0" y="0" width="1280px" height="840px" fill="#fffdf4" />
    </g>
    <g x="0" y="0" clip-path="url(#clip_header)">
        <image id="img_headerbg" x="0" y="0" width="1280px" height="640px" xlink:href="data:image/png;base64,${ogHeaderBase64}"/>
    </g>
    ${content}
    <image id="img_ccc" x="1024" y="540" width="245px" height="92px" xlink:href="data:image/png;base64,${cccBase64}"/>
</svg>
`;
}

function getSmallHeaderSvg(content: string): string {
  const headerHeight = 120;

  return `
<svg viewBox="0 0 1280 640" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
    <image x="0" y="0" width="1280px" height="640px" xlink:href="data:image/png;base64,${ogPaperBase64}"/>
    ${getJaggedClipPath("clip_edge", headerHeight + 16)}
    ${getJaggedClipPath("clip_header", headerHeight)}
    <g x="0" y="16px" clip-path="url(#clip_edge)">
        <rect x="0" y="0" width="1280px" height="840px" fill="#fffdf4" />
    </g>
    <g x="0" y="0" clip-path="url(#clip_header)">
        <image id="img_headerbg" x="0" y="0" width="1280px" height="640px" xlink:href="data:image/png;base64,${ogHeaderBase64}"/>
    </g>
    ${content}
    <image id="img_ccc" x="1024" y="540" width="245px" height="92px" xlink:href="data:image/png;base64,${cccBase64}"/>
</svg>
`;
}
