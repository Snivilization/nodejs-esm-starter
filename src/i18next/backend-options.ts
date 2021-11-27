
const OUT = "dist";
const EN = "en";
const EN_US = "en-US";
const TRANSLATION = "translation";

export const i18nextBackendOptions = {
  backend: {
    loadPath: `./${OUT}/locales/{{lng}}/{{ns}}.json`
  },
  lng: EN,
  fallbackLng: EN,
  preload: [EN, EN_US],
  ns: [TRANSLATION],
  defaultNS: TRANSLATION
};
