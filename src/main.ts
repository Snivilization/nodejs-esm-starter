import i18next from "i18next";
import Backend from "i18next-fs-backend";
import I18nextCLILanguageDetector from "i18next-cli-language-detector";

// @ts-ignore
// import * as roptions from "../rollup/options.mjs";

import { bannerInColor } from "./banner-in-colour.js";
export { add } from "./add";

// export * from "./lib-exports.js"

// out should be getting imported from "../rollup/options.mjs", but this
// import is not working, so cheat for now... Perhaps we need ambient definitions
// to import options.mjs...
//
const OUT = "dist";
const EN = "en";
const EN_US = "en-US";
const TRANSLATION = "translation";

const inoptions = {
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
await i18next
  .use(I18nextCLILanguageDetector)
  .use(Backend)
  .init(inoptions, (err, t) => {
    if (err) return console.error(err);

    console.log(`US: '${t("i18n", { lng: EN_US })}'`);
    console.log(`GB: '${t("i18n")}'`);
  });

export function banner(): string {
  const colour = i18next.t("colour-black");
  return bannerInColor(colour);
}

console.log(`===> BANNER: '${banner()}'`);
