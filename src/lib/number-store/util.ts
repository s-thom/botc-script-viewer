function decodeLengthField(bytes: Uint8Array, pointer: number): number {
  return (bytes[pointer] << 8) + bytes[pointer + 1];
}

export function sliceTLV(
  bytes: Uint8Array,
  pointer: number,
): { slice: Uint8Array; length: number; nextPointer: number } {
  const length = decodeLengthField(bytes, pointer + 1);
  const nextPointer = pointer + 3 + length;
  if (nextPointer > bytes.length) {
    throw new Error("TLV value length too long for byte array");
  }

  const slice = bytes.subarray(pointer + 3, nextPointer);

  return { slice, length, nextPointer: nextPointer };
}
