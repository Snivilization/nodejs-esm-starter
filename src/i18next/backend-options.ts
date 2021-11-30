
const OUT = "dist";
const EN_GB = "en-GB";
const EN_US = "en-US";
const TRANSLATION = "translation";
const STRATEGY = "currentOnly";

export default {
  backend: {
    loadPath: `./${OUT}/locales/{{lng}}/{{ns}}.json`
  },
  load: STRATEGY,
  fallbackLng: EN_GB,
  preload: [EN_GB, EN_US],
  ns: [TRANSLATION],
  defaultNS: TRANSLATION
};
