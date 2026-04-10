import { readFile } from "node:fs/promises";

export const sthomBase64Loader: import("vite").Plugin = {
  name: "sthom-base64-loader",
  async transform(code, id) {
    const [path, query] = id.split("?");
    if (query != "base64") return null;

    const buffer = await readFile(path);
    const base64 = buffer.toString("base64");

    return `export default '${base64}';`;
  },
};
