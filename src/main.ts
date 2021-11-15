import { bannerInColor } from "./banner-in-colour.js";
export { add } from "./add";

export function banner(): string {
  return bannerInColor("white");
}
