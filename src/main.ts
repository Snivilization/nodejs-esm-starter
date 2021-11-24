import i18next from "i18next";
import Backend from "i18next-fs-backend";

// @ts-ignore
// import * as roptions from "../rollup/options.mjs";

import { bannerInColor } from "./banner-in-colour.js";
export { add } from "./add";

// out should be getting imported from "../rollup/options.mjs", but this
// import is not working, so cheat for now... Perhaps we need ambient definitions
// to import options.mjs...
//
const OUT = "dist";
const EN = "en";
const EN_US = "en-US";
const TRANSLATION = "translation";

const options = {
  backend: {
    loadPath: `./${OUT}/locales/{{lng}}/{{ns}}.json`
  },
  lng: EN,
  fallbackLng: EN,
  preload: [EN, EN_US],
  ns: [TRANSLATION],
  defaultNS: TRANSLATION
};

// not currently using a language detector so we define explicitly with
// the "lng" property (https://www.i18next.com/overview/getting-started)
//
await i18next.use(Backend).init(options, (err, t) => {
  if (err) return console.error(err);
});

export function banner(): string {
  const colour = i18next.t("colour-black");
  return bannerInColor(colour);
}

console.log(`===> BANNER: '${banner()}'`);
