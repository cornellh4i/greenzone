import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// static import of your JSON
import mapprovince_en from "../public/en/mapprovince.json";
import sidepanel_en from "../public/en/sidepanel.json";
import mapprovince_mn from "../public/mn/mapprovince.json";
import sidepanel_mn from "../public/mn/sidepanel.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      mapprovince: mapprovince_en,
      sidepanel: sidepanel_en,
    },
    mn: {
      mapprovince: mapprovince_mn,
      sidepanel: sidepanel_mn,
    },
  },
  fallbackLng: "en",

  ns: ["mapprovince", "sidepanel"],
  defaultNS: "mapprovince",

  interpolation: { escapeValue: false },
});

export default i18n;
