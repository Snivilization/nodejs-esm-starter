import { expect, use } from "chai";
import dirtyChai from "dirty-chai";
use(dirtyChai);
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import I18nextCLILanguageDetector from "i18next-cli-language-detector";

// @ts-ignore
// import { options } from "nodejs-esm-starter/i18next";

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

describe("i18next-cli-language-detector", () => {
  before(async () => {
    await i18next
      .use(I18nextCLILanguageDetector)
      .use(Backend)
      .init(inoptions, (err, t) => {
        if (err) return console.error(err);
      });
  });

  interface IUnitTest {
    given: string,
    should: string,
    options?: { lng: string },
    expected: string
  }

  const tests: IUnitTest[] = [
    {
      given: "US specifier",
      should: "get translation in US dialect",
      options: { lng: EN_US },
      expected: "Internationalization"
    },
    {
      given: "GB specifier",
      should: "get translation in GB dialect",
      options: { lng: EN },
      expected: "Internationalisation"
    },
    {
      given: "No specifier",
      should: "get translation in default GB dialect",
      expected: "Internationalisation"
    }
  ];

  tests.forEach(t => {
    context(`given: ${t.given}`, () => {
      it(`should: ${t.should}`, () => {
        const result = t.options ? i18next.t("i18n", t.options) : i18next.t("i18n");
        expect(result).to.equal(t.expected);
      });
    });
  });
});
