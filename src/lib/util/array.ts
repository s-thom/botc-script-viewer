export function range(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

export function chunk<T>(arr: T[], maxChunkLength: number): T[][] {
  const numChunks = Math.ceil(arr.length / maxChunkLength);
  return Array.from({ length: numChunks }, (_, i) =>
    arr.slice(
      Math.floor((arr.length * i) / numChunks),
      Math.floor((arr.length * (i + 1)) / numChunks),
    ),
  );
}
