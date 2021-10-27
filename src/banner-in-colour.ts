import { promises as fs } from "fs";
import url, { URL } from "url";
import { join } from "path";
import { add } from "./add.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const text = await fs.readFile(join(__dirname, "text.txt"), "utf8");

export function bannerInColor(colour: string): string {
  const answer = add(40, 2);
  return `${colour}: ${text}: ${answer}`;
}
