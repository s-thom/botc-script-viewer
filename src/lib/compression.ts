import { AppError } from "../types/site.ts";
import { MAX_SCRIPT_SIZE_BYTES } from "./constants.ts";

export function encodeBase64(str: string, useSafeEncoding: boolean): string {
  const b64 = btoa(str);

  return useSafeEncoding
    ? b64.replace(/([+/])/g, (_, char) => {
        switch (char) {
          case "+":
            return "-";
          case "/":
            return "_";
          default:
            return char;
        }
      })
    : b64;
}

export function decodeBase64(b64: string, useSafeEncoding: boolean): string {
  const str = useSafeEncoding
    ? b64.replace(/([-_])/g, (_, char) => {
        switch (char) {
          case "-":
            return "+";
          case "_":
            return "/";
          default:
            return char;
        }
      })
    : b64;

  return atob(str);
}

export function stringToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

export function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export async function compressToBase64(
  inputBytes: Uint8Array,
  format: CompressionFormat,
  useSafeEncoding: boolean,
): Promise<string> {
  const reader = new ReadableStream({
    start(controller) {
      controller.enqueue(inputBytes);
      controller.close();
    },
  })
    .pipeThrough(new CompressionStream(format))
    .getReader();

  const compressedChunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    compressedChunks.push(value);
  }
  const compressedBytes = Uint8Array.from(
    compressedChunks.flatMap((chunk) => Array.from(chunk)),
  );

  return encodeBase64(String.fromCharCode(...compressedBytes), useSafeEncoding);
}

export async function decompressFromBase64(
  base64: string,
  format: CompressionFormat,
  useSafeEncoding: boolean,
): Promise<Uint8Array> {
  const binaryString = decodeBase64(base64, useSafeEncoding);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const reader = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  })
    .pipeThrough(new DecompressionStream(format))
    .getReader();

  let currentSize: number = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    currentSize += value.byteLength;
    if (currentSize > MAX_SCRIPT_SIZE_BYTES) {
      await reader.cancel(
        "Too big. A script is not expected to be this large.",
      );
      throw new AppError(
        `Decompressed stream larger than ${MAX_SCRIPT_SIZE_BYTES} bytes`,
        {
          status: 400,
          titleKey: "viewer.errors.urlSize",
          descriptionKey: "viewer.errors.urlSizeScriptDescription",
        },
      );
    }

    chunks.push(value);
  }
  const decompressedBytes = Uint8Array.from(
    chunks.flatMap((chunk) => Array.from(chunk)),
  );

  return decompressedBytes;
}
