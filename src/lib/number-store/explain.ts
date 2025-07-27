import { CHARACTERS_BY_ID } from "../characters";
import { bytesToString } from "../compression";
import { ORDERED_CHARACTER_LIST } from "./characters";
import { sliceTLV } from "./util";

interface ExplainBase {
  type: string;
  bytes: Uint8Array;
}

interface ExplainValue extends ExplainBase {
  type: "value";
  value: string;
  valueType: "string" | "enum" | "boolean" | "json";
}

interface ExplainTLV extends ExplainBase {
  type: "tlv";
  typeBytes: Uint8Array;
  typeName: string;
  lengthBytes: Uint8Array;
  length: number;
  valueBytes: Uint8Array;
  value: ExplainNode[];
}

interface ExplainWarning extends ExplainBase {
  type: "warning";
  message: string;
}

interface ExplainError extends ExplainBase {
  type: "error";
  message: string;
}

export type ExplainNode =
  | ExplainValue
  | ExplainTLV
  | ExplainWarning
  | ExplainError;

function explainTLV(
  bytes: Uint8Array,
  pointer: number,
  typeName: string,
  explainer: (bytes: Uint8Array) => ExplainNode[],
): { node: ExplainNode; nextPointer: number } {
  try {
    const { slice, nextPointer } = sliceTLV(bytes, pointer);
    const stringNodes = explainer(slice);

    return {
      node: {
        type: "tlv",
        typeName,
        bytes: bytes.subarray(pointer, nextPointer),
        typeBytes: bytes.subarray(pointer, pointer + 1),
        length: slice.length,
        lengthBytes: bytes.subarray(pointer + 1, pointer + 3),
        value: stringNodes,
        valueBytes: slice,
      },
      nextPointer,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Force the end of the explanation
    return {
      node: {
        type: "error",
        bytes: bytes.subarray(pointer, bytes.length),
        message: "Unrecoverable error",
      },
      nextPointer: bytes.length,
    };
  }
}

function explainDecodeJson(bytes: Uint8Array): ExplainNode[] {
  const value = bytesToString(bytes);

  return [{ type: "value", bytes, value, valueType: "json" }];
}

function explainDecodeString(bytes: Uint8Array): ExplainNode[] {
  const value = bytesToString(bytes);

  return [{ type: "value", bytes, value, valueType: "string" }];
}

function explainDecodeBoolean(bytes: Uint8Array): ExplainNode[] {
  const nodes: ExplainNode[] = [];

  const firstByte = bytes.subarray(0, 1);
  nodes.push({
    type: "value",
    bytes: firstByte,
    value: firstByte[0] === 0 ? "false" : "true",
    valueType: "boolean",
  });

  if (bytes.length > 1) {
    const restBytes = bytes.subarray(1, 1);
    nodes.push({
      type: "warning",
      bytes: restBytes,
      message: "Expected length of 1 for boolean option",
    });
  }

  return nodes;
}

function explainDecodeNightOrder(bytes: Uint8Array): ExplainNode[] {
  const nodes: ExplainNode[] = [];
  let pointer = 0;

  while (pointer < bytes.length) {
    switch (bytes[pointer]) {
      case 0:
        {
          // 0 is invalid for the night order list.
          const { nextPointer } = sliceTLV(bytes, pointer);
          nodes.push({
            type: "warning",
            bytes: bytes.subarray(pointer, nextPointer),
            message: "Invalid character ID",
          });
          pointer = nextPointer;
        }
        break;
      case 255:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Character ID",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      default:
        {
          // An official character!
          const id = ORDERED_CHARACTER_LIST[bytes[pointer] - 1];
          if (id) {
            nodes.push({
              type: "value",
              bytes: bytes.subarray(pointer, pointer + 1),
              value: CHARACTERS_BY_ID.get(id)?.name ?? id,
              valueType: "enum",
            });
          } else {
            nodes.push({
              type: "warning",
              bytes: bytes.subarray(pointer, pointer + 1),
              message: "Unknown character type",
            });
          }
          pointer++;
        }
        break;
    }
  }

  return nodes;
}

function explainDecodeMeta(bytes: Uint8Array): ExplainNode[] {
  const nodes: ExplainNode[] = [];
  let pointer = 0;

  while (pointer < bytes.length) {
    switch (bytes[pointer]) {
      case 0:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Name",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 1:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Author",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 2:
        {
          const { slice, nextPointer } = sliceTLV(bytes, pointer);
          if (slice.length === 0) {
            nodes.push({
              type: "warning",
              bytes: bytes.subarray(pointer, nextPointer),
              message: "Expected length of 1 for boolean option",
            });
            pointer = nextPointer;
          } else {
            const { node, nextPointer } = explainTLV(
              bytes,
              pointer,
              "Hide title",
              explainDecodeBoolean,
            );
            nodes.push(node);
            pointer = nextPointer;
          }
        }
        break;
      case 3:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Logo",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 4:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Background",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 5:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Almanac",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 6:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Bootlegger",
            explainDecodeString,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 7:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "First night",
            explainDecodeNightOrder,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 8:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Other night",
            explainDecodeNightOrder,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      default:
        {
          const { nextPointer } = sliceTLV(bytes, pointer);
          nodes.push({
            type: "warning",
            bytes: bytes.subarray(pointer, nextPointer),
            message: "Invalid metadata field",
          });
          pointer = nextPointer;
        }
        break;
    }
  }

  return nodes;
}

export function explainDecodeScript(bytes: Uint8Array): ExplainNode[] {
  const nodes: ExplainNode[] = [];
  let pointer = 0;

  while (pointer < bytes.length) {
    switch (bytes[pointer]) {
      case 0:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "Metadata",
            explainDecodeMeta,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      case 255:
        {
          const { node, nextPointer } = explainTLV(
            bytes,
            pointer,
            "JSON",
            explainDecodeJson,
          );
          nodes.push(node);
          pointer = nextPointer;
        }
        break;
      default:
        {
          const id = ORDERED_CHARACTER_LIST[bytes[pointer] - 1];
          if (id) {
            nodes.push({
              type: "value",
              bytes: bytes.subarray(pointer, pointer + 1),
              value: CHARACTERS_BY_ID.get(id)?.name ?? id,
              valueType: "enum",
            });
          } else {
            nodes.push({
              type: "warning",
              bytes: bytes.subarray(pointer, pointer + 1),
              message: "Unknown character type",
            });
          }
          pointer++;
        }
        break;
    }
  }

  return nodes;
}
