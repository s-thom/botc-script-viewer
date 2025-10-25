import type {
  BloodOnTheClocktowerCustomScript,
  ScriptCharacter,
  ScriptMetadata,
} from "../../generated/script-schema";
import { bytesToString, stringToBytes } from "../compression";
import { ORDERED_CHARACTER_LIST } from "./characters";
import { sliceTLV } from "./util";

// A binary serialisation format for Blood on the Clocktower scripts.
// Read docs/number-store-v1.md for more info.

// Something short enough that in a lot of cases it won't need resizing much.
const INITIAL_BUFFER_SIZE = 128;
// 4KiB
const MAX_BUFFER_SIZE = 4096;

function ensureBufferSize(bytes: Uint8Array, length: number) {
  if (length >= bytes.byteLength) {
    // Resize the buffer to the next power of 2.
    const pow2 = Math.pow(2, Math.ceil(Math.log(length + 1) / Math.log(2)));
    (bytes.buffer as ArrayBuffer).resize(pow2);
  }
}

function appendValue(bytes: Uint8Array, pointer: number, value: number) {
  ensureBufferSize(bytes, pointer);

  bytes[pointer] = value;
  return pointer + 1;
}

function appendTLV(
  bytes: Uint8Array,
  pointer: number,
  type: number,
  newBytes: Uint8Array,
) {
  const newPointer = pointer + 3 + newBytes.length;
  ensureBufferSize(bytes, newPointer);

  const lengthLower = newBytes.length & 0xff;
  const lengthUpper = (newBytes.length & 0xff00) >> 8;

  bytes[pointer] = type;
  bytes[pointer + 1] = lengthUpper;
  bytes[pointer + 2] = lengthLower;

  for (let i = 0; i < newBytes.length; i++) {
    bytes[pointer + 3 + i] = newBytes[i];
  }
  return newPointer;
}

function encodeNightOrder(ids: string[]): Uint8Array {
  const buffer = new ArrayBuffer(128, {
    maxByteLength: MAX_BUFFER_SIZE,
  });
  const bytes = new Uint8Array(buffer);

  let pointer = 0;

  for (const id of ids) {
    const index = ORDERED_CHARACTER_LIST.indexOf(id);
    if (index > -1) {
      pointer = appendValue(bytes, pointer, index + 1);
      continue;
    }

    pointer = appendTLV(bytes, pointer, 0xff, stringToBytes(id));
  }

  // At this point the pointer should be the length of the actual content.
  const resizedBuffer = bytes.slice(0, pointer);
  return resizedBuffer;
}

function encodeScriptMeta(meta: ScriptMetadata): Uint8Array {
  const buffer = new ArrayBuffer(128, {
    maxByteLength: MAX_BUFFER_SIZE,
  });
  const bytes = new Uint8Array(buffer);

  let pointer = 0;

  if (meta.name) {
    pointer = appendTLV(bytes, pointer, 0, stringToBytes(meta.name));
  }
  if (meta.author) {
    pointer = appendTLV(bytes, pointer, 1, stringToBytes(meta.author));
  }
  if (meta.hideTitle) {
    pointer = appendValue(bytes, pointer, 2); // Type = 2
    pointer = appendValue(bytes, pointer, 0); // Length = 0x0001
    pointer = appendValue(bytes, pointer, 1);
    pointer = appendValue(bytes, pointer, 1); // Value = 1
  }
  if (meta.logo) {
    pointer = appendTLV(bytes, pointer, 3, stringToBytes(meta.logo));
  }
  if (meta.background) {
    pointer = appendTLV(bytes, pointer, 4, stringToBytes(meta.background));
  }
  if (meta.almanac) {
    pointer = appendTLV(bytes, pointer, 5, stringToBytes(meta.almanac));
  }
  if (meta.bootlegger) {
    for (const rule of meta.bootlegger) {
      pointer = appendTLV(bytes, pointer, 6, stringToBytes(rule));
    }
  }
  if (meta.firstNight) {
    pointer = appendTLV(bytes, pointer, 7, encodeNightOrder(meta.firstNight));
  }
  if (meta.otherNight) {
    pointer = appendTLV(bytes, pointer, 7, encodeNightOrder(meta.otherNight));
  }

  // At this point the pointer should be the length of the actual content.
  const resizedBuffer = bytes.slice(0, pointer);
  return resizedBuffer;
}

export function encodeScript(
  script: BloodOnTheClocktowerCustomScript,
): Uint8Array {
  // The buffer will be at least as long as the script itself.
  const buffer = new ArrayBuffer(INITIAL_BUFFER_SIZE, {
    maxByteLength: MAX_BUFFER_SIZE,
  });
  const bytes = new Uint8Array(buffer);

  let pointer = 0;

  for (const item of script) {
    if (typeof item === "string") {
      const index = ORDERED_CHARACTER_LIST.indexOf(item);
      if (index === -1) {
        throw new Error(`Unknown character ${item}`);
      }

      pointer = appendValue(bytes, pointer, index + 1);
    } else if (item.id === "_meta") {
      const meta = item as ScriptMetadata;

      const slice = encodeScriptMeta(meta);
      pointer = appendTLV(bytes, pointer, 0, slice);
    } else {
      const index = ORDERED_CHARACTER_LIST.indexOf(item.id);
      if (index > -1) {
        // Possible bug: if a script defines a custom character with the same ID as
        // an official one, then those customisations will be lost.
        pointer = appendValue(bytes, pointer, index + 1);
        continue;
      }

      // Is custom character
      const newBytes = stringToBytes(JSON.stringify(item));
      pointer = appendTLV(bytes, pointer, 0xff, newBytes);
    }
  }

  // At this point the pointer should be the length of the actual content.
  const resizedBuffer = bytes.slice(0, pointer);
  return resizedBuffer;
}

function decodeNightOrderList(bytes: Uint8Array): string[] {
  const list: string[] = [];
  let pointer = 0;

  while (pointer < bytes.length) {
    switch (bytes[pointer]) {
      case 0:
        {
          // 0 is invalid for the night order list.
          const { nextPointer } = sliceTLV(bytes, pointer);
          pointer = nextPointer;
        }
        break;
      case 255:
        {
          // String value
          const { slice, nextPointer } = sliceTLV(bytes, pointer);
          const str = bytesToString(slice);
          list.push(str);

          pointer = nextPointer;
        }
        break;
      default:
        {
          const id = ORDERED_CHARACTER_LIST[bytes[pointer] - 1];
          if (id) {
            list.push(id);
          } else {
            console.warn(
              `Unknown character type encountered in night order (${bytes[pointer]})`,
            );
          }
          pointer++;
        }
        break;
    }
  }

  if (pointer !== bytes.length) {
    console.warn("Unread bytes at end of night order list");
  }

  return list;
}

function decodeScriptMetadata(bytes: Uint8Array): ScriptMetadata {
  const meta: ScriptMetadata = { id: "_meta", name: "" };
  let pointer = 0;

  while (pointer < bytes.length) {
    const { slice, length, nextPointer } = sliceTLV(bytes, pointer);

    switch (bytes[pointer]) {
      case 0:
        meta.name = bytesToString(slice);
        break;
      case 1:
        meta.author = bytesToString(slice);
        break;
      case 2:
        if (length !== 1) {
          throw new Error(
            `Invalid length for Hide Title field. Expected 1, Got ${length}`,
          );
        }
        meta.hideTitle = slice[0] !== 0;
        break;
      case 3:
        meta.logo = bytesToString(slice);
        break;
      case 4:
        meta.background = bytesToString(slice);
        break;
      case 5:
        meta.almanac = bytesToString(slice);
        break;
      case 6:
        meta.bootlegger ??= [];
        meta.bootlegger.push(bytesToString(slice));
        break;
      case 7:
        meta.firstNight = decodeNightOrderList(slice);
        break;
      case 8:
        meta.otherNight = decodeNightOrderList(slice);
        break;
      default:
        // Unknown TLV, Do nothing
        console.warn(`Unknown metadata field encountered (${bytes[pointer]})`);
    }

    pointer = nextPointer;
  }

  if (pointer !== bytes.length) {
    console.warn("Unread bytes at end of metadata");
  }

  return meta;
}

function decodeJson(bytes: Uint8Array): ScriptCharacter | ScriptCharacter[] {
  const str = bytesToString(bytes);
  return JSON.parse(str);
}

export function decodeScript(
  bytes: Uint8Array,
): BloodOnTheClocktowerCustomScript {
  const script: BloodOnTheClocktowerCustomScript = [];
  let pointer = 0;

  while (pointer < bytes.length) {
    switch (bytes[pointer]) {
      case 0:
        {
          // Script metadata
          const { slice, nextPointer } = sliceTLV(bytes, pointer);
          const meta = decodeScriptMetadata(slice);
          script.push(meta);

          pointer = nextPointer;
        }
        break;
      case 255:
        {
          // JSON string wrapped in TLV
          const { slice, nextPointer } = sliceTLV(bytes, pointer);
          const json = decodeJson(slice);
          if (Array.isArray(json)) {
            script.push(...json);
          } else {
            script.push(json);
          }

          pointer = nextPointer;
        }
        break;
      default:
        {
          // An official character!
          const id = ORDERED_CHARACTER_LIST[bytes[pointer] - 1];
          if (id) {
            script.push(id);
          } else {
            console.warn(
              `Unknown character type encountered (${bytes[pointer]})`,
            );
          }
          pointer++;
        }
        break;
    }
  }

  if (pointer !== bytes.length) {
    console.warn("Unread bytes at end of script");
  }

  return script;
}
