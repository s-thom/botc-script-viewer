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
    `<text x="640" y="90" text-anchor="middle" class="title" font-size="56" font-weight="bold" fill="#fdedc9">
      ${t.string("viewer.common.nameLong").value}
    </text>`,
  ];

  const title =
    overrideTitle ??
    normalisedScript.name ??
    t.string("viewer.script.untitledScript").value;
  let titleHeight = 360;

  // Add character icons if there aren't too many, or too many of a particular type.
  if (normalisedScript.characters.length <= 32) {
    const charactersByType = Object.groupBy(
      normalisedScript.characters,
      (c) => c.team,
    );
    if (Object.values(charactersByType).every((type) => type.length <= 15)) {
      titleHeight = 230;

      const CHARACTER_CENTER_X = 640;
      const CHARACTER_CENTER_Y = 380;

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

function getBigHeaderSvg(content: string): string {
  return `
<svg viewBox="0 0 1280 640" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
    <image x="0" y="0" width="1280px" height="640px" xlink:href="data:image/png;base64,${ogPaperBase64}"/>
    <clipPath id="clip_edge">
        <path d="M188.76,446.316L32.902,437.713L0,440.306L0,16L1280,16L1280,439.104L1252.368,438.303L1097.029,445.114L794.175,436.7L636.324,439.785L490.586,433.549L337.212,435.396L188.76,446.316Z"/>
    </clipPath>
    <clipPath id="clip_header">
        <path d="M188.76,430.316L32.902,421.713L0,424.306L0,-0L1280,-0L1280,423.104L1252.368,422.303L1097.029,429.114L794.175,420.7L636.324,423.785L490.586,417.549L337.212,419.396L188.76,430.316Z"/>
    </clipPath>
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
  return `
<svg viewBox="0 0 1280 640" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
    <image x="0" y="0" width="1280px" height="640px" xlink:href="data:image/png;base64,${ogPaperBase64}"/>
    <clipPath id="clip_edge">
        <path d="M188.76,191.025L32.902,182.423L0,185.016L0,16L1280,16L1280,183.814L1252.368,183.012L1097.029,189.823L794.175,181.41L636.324,184.495L490.586,178.259L337.212,180.105L188.76,191.025Z"/>
    </clipPath>
    <clipPath id="clip_header">
        <path d="M188.76,175.025L32.902,166.423L0,169.016L0,-0L1280,-0L1280,167.814L1252.368,167.012L1097.029,173.823L794.175,165.41L636.324,168.495L490.586,162.259L337.212,164.105L188.76,175.025Z"/>
    </clipPath>
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
